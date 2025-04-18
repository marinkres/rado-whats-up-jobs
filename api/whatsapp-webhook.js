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

  // 2. Ako je "PRIJAVA" i kandidat ne postoji, kreiraj ga i traži ime
  if (body.toUpperCase() === "PRIJAVA") {
    if (!candidate) {
      // Popuni name s praznim stringom (ili "N/A") da zadovolji NOT NULL constraint
      const { data: newCandidate, error: newCandidateError } = await supabase
        .from("candidates")
        .insert([{ phone: fromNumber, name: "", created_at: new Date().toISOString() }]) // <-- name: ""
        .select();
      if (newCandidateError || !newCandidate || newCandidate.length === 0) {
        console.error("Supabase newCandidateError:", newCandidateError);
        return res.status(500).send("Supabase error (candidate insert)");
      }
      candidate = newCandidate[0];
    }
    candidate_id = candidate.id;

    // Stvori conversation
    const { data: newConv, error: newConvError } = await supabase
      .from("conversations")
      .insert([{ candidate_id, created_at: new Date().toISOString() }])
      .select();
    const conversation_id = newConv && newConv.length > 0 ? newConv[0].id : null;

    // Spremi poruku
    await supabase.from("messages").insert([
      {
        conversation_id,
        sender: "candidate",
        content: body,
        sent_at: new Date().toISOString(),
      },
    ]);

    // Pošalji pitanje za ime i prezime
    try {
      await client.messages.create({
        from,
        to: fromNumber,
        body: "Bok! Ja sam Rado 🤖\nPomoći ću ti da se prijaviš za posao. Prvo mi reci svoje ime i prezime:",
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

    // Ako nema ime, upiši ime i traži jezike
    if (!candidate.name) {
      await supabase.from("candidates").update({ name: body }).eq("id", candidate_id);
      try {
        await client.messages.create({
          from,
          to: fromNumber,
          body: "Super, hvala! Koje jezike govoriš?",
        });
      } catch (err) {
        console.error("Twilio auto-reply error:", err);
      }
      return res.status(200).send("<Response></Response>");
    }

    // Ako nema jezike, upiši jezike i traži dostupnost
    if (!candidate.languages) {
      await supabase.from("candidates").update({ languages: body }).eq("id", candidate_id);
      try {
        await client.messages.create({
          from,
          to: fromNumber,
          body: "Odlično! Kada si dostupan za rad?",
        });
      } catch (err) {
        console.error("Twilio auto-reply error:", err);
      }
      return res.status(200).send("<Response></Response>");
    }

    // Ako nema dostupnost, upiši dostupnost i traži iskustvo
    if (!candidate.availability) {
      await supabase.from("candidates").update({ availability: body }).eq("id", candidate_id);
      try {
        await client.messages.create({
          from,
          to: fromNumber,
          body: "Hvala! Imaš li prethodnog iskustva? Ukratko opiši.",
        });
      } catch (err) {
        console.error("Twilio auto-reply error:", err);
      }
      return res.status(200).send("<Response></Response>");
    }

    // Ako nema iskustvo, upiši iskustvo i završi prijavu
    if (!candidate.experience) {
      await supabase.from("candidates").update({ experience: body }).eq("id", candidate_id);
      try {
        await client.messages.create({
          from,
          to: fromNumber,
          body: "Hvala na prijavi! Poslodavac će te kontaktirati čim prije. Sretno! 🍀",
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
