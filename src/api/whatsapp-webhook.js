const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const from = req.body.From;
  const body = req.body.Body;
  // You may want to parse conversation_id and sender from the message or map phone numbers to users

  // Example: Save incoming message to Supabase (customize as needed)
  await supabase.from("messages").insert([
    {
      conversation_id: 1, // You need to resolve the correct conversation
      sender: from,
      content: body,
      sent_at: new Date().toISOString(),
    },
  ]);

  res.status(200).send("<Response></Response>");
};
