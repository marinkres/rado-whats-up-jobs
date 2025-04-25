import axios from "axios";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { webhook_url } = req.query;
  
  if (!webhook_url) {
    return res.status(400).json({ error: "Missing webhook_url parameter" });
  }

  try {
    // Set webhook for Telegram
    const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`;
    const response = await axios.post(apiUrl, {
      url: webhook_url,
      allowed_updates: ["message"]
    });

    console.log("Webhook setup response:", response.data);

    // Get webhook info to verify
    const webhookUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`;
    const webhookInfo = await axios.get(webhookUrl);
    
    return res.status(200).json({
      message: "Webhook setup completed",
      setupResult: response.data,
      webhookInfo: webhookInfo.data
    });
  } catch (error) {
    console.error("Error in setup-telegram-webhook:", error);
    return res.status(500).json({
      error: "Failed to set up webhook",
      details: error.message,
      response: error.response?.data
    });
  }
}
