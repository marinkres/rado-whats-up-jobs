import { createClient } from "@supabase/supabase-js";
import querystring from "querystring";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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

  const from = bodyObj.From; // e.g. "whatsapp:+385994793004"
  const body = bodyObj.Body;

  // 1. Lookup candidate by WhatsApp number (adjust column name as needed)
  const { data: candidates, error: candidateError } = await supabase
    .from("candidates")
    .select("id")
    .eq("phone", from) // or .eq("whatsapp_id", from)
    .limit(1);

  if (candidateError || !candidates || candidates.length === 0) {
    console.error("Candidate not found for WhatsApp number:", from);
    return res.status(400).send("Candidate not found");
  }

  const candidate_id = candidates[0].id;

  // 2. Find or create conversation for this candidate
  let conversation_id = null;
  const { data: conversations } = await supabase
    .from("conversations")
    .select("id")
    .eq("candidate_id", candidate_id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (conversations && conversations.length > 0) {
    conversation_id = conversations[0].id;
  } else {
    const { data: newConv, error } = await supabase
      .from("conversations")
      .insert([{ candidate_id, created_at: new Date().toISOString() }])
      .select();
    if (newConv && newConv.length > 0) {
      conversation_id = newConv[0].id;
    }
  }

  if (!conversation_id) {
    return res.status(500).send("Could not resolve conversation");
  }

  await supabase.from("messages").insert([
    {
      conversation_id,
      sender: from,
      content: body,
      sent_at: new Date().toISOString(),
    },
  ]);

  res.status(200).send("<Response></Response>");
}
