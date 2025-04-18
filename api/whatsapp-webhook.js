import { createClient } from "@supabase/supabase-js";
import querystring from "querystring";
import twilio from "twilio";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_WHATSAPP_NUMBER;
const client = twilio(accountSid, authToken);

const MESSAGES = {
  hr: {
    welcome: "Bok! Ja sam Rado 🤖\nZa nastavak odaberi jezik (choose language):\n1️⃣ Hrvatski\n2️⃣ English",
    askName: "Kako se zoveš? (ime i prezime)",
    askLanguages: "Koje jezike govoriš?",
    askAvailability: "Kada si dostupan za rad?",
    askExperience: "Imaš li prethodnog iskustva? Ukratko opiši.",
    thanks: "Hvala na prijavi! Poslodavac će te kontaktirati čim prije. Sretno! 🍀",
  },
  en: {
    welcome: "Hi! I'm Rado 🤖\nPlease choose your language:\n1️⃣ Hrvatski\n2️⃣ English",
    askName: "What's your full name?",
    askLanguages: "Which languages do you speak?",
    askAvailability: "When are you available to work?",
    askExperience: "Do you have previous experience? Briefly describe.",
    thanks: "Thank you for applying! The employer will contact you soon. Good luck! 🍀",
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  // Parse x-www-form-urlencoded body for Vercel
  let bodyObj = req.body;
  if (!bodyObj || Object.keys(bodyObj).length === 0) {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const rawBody = Buffer.concat(buffers).toString();
    bodyObj = querystring.parse(rawBody);
  }

  const fromNumber = bodyObj.From;
  const body = (bodyObj.Body || "").trim();

  // 1. Pronađi kandidata po broju
  let { data: candidates, error: candidateError } = await supabase
    .from("candidates")
    .select("*")
    .eq("phone", fromNumber)
    .limit(1);

  let candidate_id;
  let candidate = candidates && candidates.length > 0 ? candidates[0] : null;

  // 2. Ako je "PRIJAVA" ili "PRIJAVA:{job_id}" i kandidat ne postoji, kreiraj ga i pitaj za jezik
  let prijavaJobId = null;
  // Ispravi regex da podržava i UUID (ne samo brojeve)
  let prijavaMatch = body.toUpperCase().match(/^PRIJAVA(?::([A-Z0-9-]+))?$/i);
  if (prijavaMatch) {
    prijavaJobId = prijavaMatch[1] ? prijavaMatch[1] : null;
    if (!candidate) {
      const { data: newCandidate, error: newCandidateError } = await supabase
        .from("candidates")
        .insert([{ phone: fromNumber, name: "", created_at: new Date().toISOString() }])
        .select();
      if (newCandidateError || !newCandidate || newCandidate.length === 0) {
        console.error("Supabase newCandidateError:", newCandidateError);
        return res.status(500).send("Supabase error (candidate insert)");
      }
      candidate = newCandidate[0];
    }
    candidate_id = candidate.id;

    // Provjeri postoji li već conversation za ovog kandidata i taj job_id
    let conversation_id = null;
    if (prijavaJobId) {
      const { data: existingConv } = await supabase
        .from("conversations")
        .select("id")
        .eq("candidate_id", candidate_id)
        .eq("job_id", prijavaJobId)
        .order("created_at", { ascending: false })
        .limit(1);
      if (existingConv && existingConv.length > 0) {
        conversation_id = existingConv[0].id;
      }
    }
    // Ako ne postoji, kreiraj novi conversation
    if (!conversation_id) {
      const { data: newConv } = await supabase
        .from("conversations")
        .insert([{ candidate_id, job_id: prijavaJobId, created_at: new Date().toISOString() }])
        .select();
      conversation_id = newConv && newConv.length > 0 ? newConv[0].id : null;
    }

    // Spremi poruku
    await supabase.from("messages").insert([
      {
        conversation_id,
        sender: "candidate",
        content: body,
        sent_at: new Date().toISOString(),
      },
    ]);

    // Pošalji izbor jezika kao WhatsApp "gumbove" (interactive message)
    try {
      await client.messages.create({
        from,
        to: fromNumber,
        body: MESSAGES.hr.welcome,
      });
    } catch (err) {
      console.error("Twilio auto-reply error:", err);
    }
    return res.status(200).send("<Response></Response>");
  }

  // 3. Ako kandidat postoji, onboarding logika po koracima
  if (candidate) {
    candidate_id = candidate.id;

    // Pronađi najnoviji conversation
    let { data: conversations } = await supabase
      .from("conversations")
      .select("id")
      .eq("candidate_id", candidate_id)
      .order("created_at", { ascending: false })
      .limit(1);
    const conversation_id = conversations && conversations.length > 0 ? conversations[0].id : null;

    // Spremi svaku poruku
    await supabase.from("messages").insert([
      {
        conversation_id,
        sender: "candidate",
        content: body,
        sent_at: new Date().toISOString(),
      },
    ]);

    // 3a. Ako kandidat još nije odabrao jezik
    if (!candidate.language_choice) {
      let lang = null;
      if (body === "1" || body.toLowerCase() === "hr" || body.toLowerCase() === "hrvatski") lang = "hr";
      if (body === "2" || body.toLowerCase() === "en" || body.toLowerCase() === "english") lang = "en";
      if (!lang) {
        // Ponovno pitaj za jezik ako unos nije valjan
        try {
          await client.messages.create({
            from,
            to: fromNumber,
            body: MESSAGES.hr.welcome,
          });
        } catch (err) {
          console.error("Twilio auto-reply error:", err);
        }
        return res.status(200).send("<Response></Response>");
      }
      await supabase.from("candidates").update({ language_choice: lang }).eq("id", candidate_id);
      // Nastavi na sljedeći korak na odabranom jeziku
      try {
        await client.messages.create({
          from,
          to: fromNumber,
          body: MESSAGES[lang].askName,
        });
      } catch (err) {
        console.error("Twilio auto-reply error:", err);
      }
      return res.status(200).send("<Response></Response>");
    }

    const lang = candidate.language_choice || "hr";

    // 3b. Ako nema ime, upiši ime i traži jezike
    if (!candidate.name) {
      await supabase.from("candidates").update({ name: body }).eq("id", candidate_id);
      try {
        await client.messages.create({
          from,
          to: fromNumber,
          body: MESSAGES[lang].askLanguages,
        });
      } catch (err) {
        console.error("Twilio auto-reply error:", err);
      }
      return res.status(200).send("<Response></Response>");
    }

    // 3c. Ako nema jezike, upiši jezike i traži dostupnost
    if (!candidate.languages) {
      await supabase.from("candidates").update({ languages: body }).eq("id", candidate_id);
      try {
        await client.messages.create({
          from,
          to: fromNumber,
          body: MESSAGES[lang].askAvailability,
        });
      } catch (err) {
        console.error("Twilio auto-reply error:", err);
      }
      return res.status(200).send("<Response></Response>");
    }

    // 3d. Ako nema dostupnost, upiši dostupnost i traži iskustvo
    if (!candidate.availability) {
      await supabase.from("candidates").update({ availability: body }).eq("id", candidate_id);
      try {
        await client.messages.create({
          from,
          to: fromNumber,
          body: MESSAGES[lang].askExperience,
        });
      } catch (err) {
        console.error("Twilio auto-reply error:", err);
      }
      return res.status(200).send("<Response></Response>");
    }

    // 3e. Ako nema iskustvo, upiši iskustvo i završi prijavu
    if (!candidate.experience) {
      await supabase.from("candidates").update({ experience: body }).eq("id", candidate_id);
      try {
        await client.messages.create({
          from,
          to: fromNumber,
          body: MESSAGES[lang].thanks,
        });
      } catch (err) {
        console.error("Twilio auto-reply error:", err);
      }
      return res.status(200).send("<Response></Response>");
    }

    // Ako je sve popunjeno, možeš ignorirati ili poslati generičku poruku
    return res.status(200).send("<Response></Response>");
  }

  // Ako kandidat nije pronađen i nije "PRIJAVA"
  return res.status(200).send("<Response></Response>");
}
