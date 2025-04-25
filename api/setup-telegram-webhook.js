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

  try {
    console.log(`Setting up webhook with URL: ${webhook_url}`);
    console.log(`Using bot token: ${TELEGRAM_BOT_TOKEN ? TELEGRAM_BOT_TOKEN.substring(0, 10) + '...' : 'Not set'}`);
    
    // First verify the bot token is valid by checking getMe
    const getMeUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`;
    let botInfo;
    
    try {
      const botResponse = await axios.get(getMeUrl);
      botInfo = botResponse.data;
      console.log("Bot info verified:", botInfo);
      
      if (!botInfo.ok) {
        return res.status(400).json({
          error: "Invalid bot token",
          botInfo
        });
      }
    } catch (botError) {
      console.error("Error verifying bot token:", botError);
      return res.status(400).json({
        error: "Failed to verify bot token",
        details: botError.message,
        response: botError.response?.data
      });
    }

    // If bot verification passed, try to set webhook
    const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`;
    const response = await axios.post(apiUrl, {
      url: webhook_url,
      allowed_updates: ["message"]
    });

    console.log("Webhook setup response:", response.data);

    // Get webhook info to verify
    const webhookInfoUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`;
    const webhookInfo = await axios.get(webhookInfoUrl);
    
    return res.status(200).json({
      message: "Webhook setup attempt completed",
      setupResult: response.data,
      webhookInfo: webhookInfo.data,
      botInfo: botInfo
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
