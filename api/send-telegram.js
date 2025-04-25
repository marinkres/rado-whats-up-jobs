import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, candidate_id } = req.body;
  if (!message || !candidate_id) {
    return res.status(400).json({ error: "Message and candidate_id are required" });
  }

  // Get candidate's Telegram ID from database
  const { data, error } = await supabase
    .from("candidates")
    .select("telegram_id")
    .eq("id", candidate_id)
    .single();

  if (error || !data || !data.telegram_id) {
    return res.status(400).json({ error: "Candidate not found or has no Telegram ID" });
  }

  const chatId = data.telegram_id;

  try {
    await sendTelegramMessage(chatId, message);
    res.status(200).json({ reply: "Message sent via Telegram!" });
  } catch (err) {
    console.error("Telegram error:", err);
    res.status(500).json({ error: "Failed to send Telegram message" });
  }
}

async function sendTelegramMessage(chatId, text) {
  const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await axios.post(apiUrl, {
    chat_id: chatId,
    text: text
  });
}
