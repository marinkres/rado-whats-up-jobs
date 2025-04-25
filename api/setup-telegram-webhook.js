import axios from "axios";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhook_url = req.query.webhook_url || (req.body && req.body.webhook_url);
  
  if (!webhook_url) {
    return res.status(400).json({ error: "Missing webhook_url parameter" });
  }

  // Ensure the TELEGRAM_BOT_TOKEN is available
  if (!TELEGRAM_BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN is not defined in environment variables");
    return res.status(500).json({ error: "Telegram bot token is not configured" });
  }

  try {
    console.log(`Setting up webhook with URL: ${webhook_url}`);
    console.log(`Using bot token: ${TELEGRAM_BOT_TOKEN ? TELEGRAM_BOT_TOKEN.substring(0, 10) + '...' : 'Not set'}`);
    
    // Set webhook
    const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`;
    
    // Make the request directly, no JSON body conversion
    const response = await axios.get(`${apiUrl}?url=${encodeURIComponent(webhook_url)}&allowed_updates=["message"]`);

    console.log("Webhook setup response:", response.data);

    // Get webhook info to verify
    const webhookInfoUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`;
    const webhookInfo = await axios.get(webhookInfoUrl);
    
    return res.status(200).json({
      message: "Webhook setup attempt completed",
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
