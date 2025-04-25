import axios from "axios";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export default async function handler(req, res) {
  try {
    // Get webhook info
    const webhookUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`;
    const webhookInfo = await axios.get(webhookUrl);
    
    return res.status(200).json({
      webhookInfo: webhookInfo.data
    });
  } catch (error) {
    console.error("Error getting webhook info:", error);
    return res.status(500).json({
      error: "Failed to get webhook info",
      details: error.message,
      response: error.response?.data
    });
  }
}
