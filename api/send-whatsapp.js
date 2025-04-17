import { createClient } from "@supabase/supabase-js";
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
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, candidate_id } = req.body;
  if (!message || !candidate_id) {
    return res.status(400).json({ error: "Message and candidate_id are required" });
  }

  // Dohvati broj kandidata iz baze
  const { data, error } = await supabase
    .from("candidates")
    .select("phone")
    .eq("id", candidate_id)
    .single();

  if (error || !data) {
    return res.status(400).json({ error: "Candidate not found" });
  }

  const to = data.phone; // npr. "whatsapp:+385994793004"

  try {
    await client.messages.create({
      from,
      to,
      body: message,
    });
    res.status(200).json({ reply: "Message sent via WhatsApp!" });
  } catch (err) {
    console.error("Twilio error:", err);
    res.status(500).json({ error: "Failed to send WhatsApp message" });
  }
}
