const twilio = require("twilio");
const { createClient } = require("@supabase/supabase-js");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_WHATSAPP_NUMBER;
const to = process.env.TWILIO_TARGET_NUMBER;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!accountSid || !authToken || !from || !to || !supabaseUrl || !supabaseKey) {
  console.error("Missing required environment variables for Twilio or Supabase");
  // Optionally throw or exit
}

const supabase = createClient(supabaseUrl, supabaseKey);
const client = twilio(accountSid, authToken);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, conversation_id, sender } = req.body;
  if (!message || !conversation_id || !sender) {
    return res.status(400).json({ error: "Message, conversation_id, and sender are required" });
  }

  try {
    await client.messages.create({
      from,
      to,
      body: message,
    });

    const { error: dbError } = await supabase
      .from("messages")
      .insert([
        {
          conversation_id,
          sender,
          content: message,
          sent_at: new Date().toISOString(),
        },
      ]);
    if (dbError) {
      console.error("Supabase error:", dbError);
      return res.status(500).json({ error: "Failed to save message in database" });
    }

    res.status(200).json({ reply: "Message sent via WhatsApp!" });
  } catch (error) {
    console.error("Twilio error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};
