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

  console.log("Twilio webhook hit!", req.method, bodyObj);

  const fromNumber = bodyObj.From; // e.g. "whatsapp:+385994793004"
  const body = (bodyObj.Body || "").trim();

  // Ako kandidat šalje "PRIJAVA" (case-insensitive)
  if (body.toUpperCase() === "PRIJAVA") {
    // 1. Provjeri postoji li kandidat
    const { data: candidates, error: candidateError } = await supabase
      .from("candidates")
      .select("id")
      .eq("phone", fromNumber)
      .limit(1);

    let candidate_id;
    if (candidateError) {
      console.error("Supabase candidateError:", candidateError);
      return res.status(500).send("Supabase error (candidate lookup)");
    }

    if (!candidates || candidates.length === 0) {
      // 2. Ako ne postoji, stvori kandidata
      const { data: newCandidate, error: newCandidateError } = await supabase
        .from("candidates")
        .insert([{ phone: fromNumber, created_at: new Date().toISOString() }])
        .select();
      if (newCandidateError || !newCandidate || newCandidate.length === 0) {
        console.error("Supabase newCandidateError:", newCandidateError);
        return res.status(500).send("Supabase error (candidate insert)");
      }
      candidate_id = newCandidate[0].id;
    } else {
      candidate_id = candidates[0].id;
    }

    // 3. Stvori novi conversation thread
    const { data: newConv, error: newConvError } = await supabase
      .from("conversations")
      .insert([{ candidate_id, created_at: new Date().toISOString() }])
      .select();
    if (newConvError || !newConv || newConv.length === 0) {
      console.error("Supabase newConvError:", newConvError);
      return res.status(500).send("Supabase error (conversation insert)");
    }
    const conversation_id = newConv[0].id;

    // 4. Spremi inicijalnu poruku u messages
    await supabase.from("messages").insert([
      {
        conversation_id,
        sender: "candidate",
        content: body,
        sent_at: new Date().toISOString(),
      },
    ]);

    // 5. Pošalji automatsku WhatsApp poruku
    try {
      await client.messages.create({
        from,
        to: fromNumber,
        body:
          "Bok! Ja sam Rado 🤖\nPomoći ću ti da se prijaviš za posao. Prvo mi reci svoje ime i prezime:",
      });
    } catch (err) {
      console.error("Twilio auto-reply error:", err);
    }

    return res.status(200).send("<Response></Response>");
  }

  // 1. Lookup candidate by WhatsApp number (column "phone")
  const { data: candidates, error: candidateError } = await supabase
    .from("candidates")
    .select("id")
    .eq("phone", fromNumber)
    .limit(1);

  if (candidateError) {
    console.error("Supabase candidateError:", candidateError);
    return res.status(500).send("Supabase error (candidate lookup)");
  }
  if (!candidates || candidates.length === 0) {
    console.error("Candidate not found for WhatsApp number:", fromNumber);
    return res.status(400).send("Candidate not found");
  }

  const candidate_id = candidates[0].id;

  // 2. Find or create conversation for this candidate
  let conversation_id = null;
  const { data: conversations, error: convError } = await supabase
    .from("conversations")
    .select("id")
    .eq("candidate_id", candidate_id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (convError) {
    console.error("Supabase convError:", convError);
    return res.status(500).send("Supabase error (conversation lookup)");
  }

  if (conversations && conversations.length > 0) {
    conversation_id = conversations[0].id;
  } else {
    const { data: newConv, error: newConvError } = await supabase
      .from("conversations")
      .insert([{ candidate_id, created_at: new Date().toISOString() }])
      .select();
    if (newConvError) {
      console.error("Supabase newConvError:", newConvError);
      return res.status(500).send("Supabase error (conversation insert)");
    }
    if (newConv && newConv.length > 0) {
      conversation_id = newConv[0].id;
    }
  }

  if (!conversation_id) {
    console.error("Could not resolve conversation for candidate:", candidate_id);
    return res.status(500).send("Could not resolve conversation");
  }

  // 3. Insert message (sender must be "candidate" for WhatsApp incoming)
  const { error: msgError } = await supabase.from("messages").insert([
    {
      conversation_id,
      sender: "candidate",
      content: body,
      sent_at: new Date().toISOString(),
    },
  ]);
  if (msgError) {
    console.error("Supabase msgError:", msgError);
    return res.status(500).send("Supabase error (message insert)");
  }

  res.status(200).send("<Response></Response>");
}
