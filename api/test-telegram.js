import axios from "axios";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { chat_id, message } = req.query;
  
  if (!chat_id) {
    return res.status(400).json({ error: "Missing chat_id parameter" });
  }

  const textToSend = message || "Test message from Rado Jobs";

  try {
    // Send test message to Telegram
    const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await axios.post(apiUrl, {
      chat_id: chat_id,
      text: textToSend
    });

    console.log("Sent test message to Telegram:", response.data);

    // Get webhook info
    const webhookUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`;
    const webhookInfo = await axios.get(webhookUrl);
    
    // Return both results
    return res.status(200).json({
      message: "Test message sent successfully",
      messageSent: response.data,
      webhookInfo: webhookInfo.data
    });
  } catch (error) {
    console.error("Error in test-telegram:", error);
    return res.status(500).json({
      error: "Failed to send test message",
      details: error.message,
      response: error.response?.data
    });
  }
}
