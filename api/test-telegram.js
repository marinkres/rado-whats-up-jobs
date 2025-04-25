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

  // Ensure the TELEGRAM_BOT_TOKEN is available
  if (!TELEGRAM_BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN is not defined in environment variables");
    return res.status(500).json({ error: "Telegram bot token is not configured" });
  }

  const textToSend = message || "Test message from Rado Jobs";

  try {
    // Check if the placeholder chat_id is being used
    if (chat_id === "YOUR_CHAT_ID") {
      return res.status(400).json({
        error: "Please provide a real Telegram chat ID",
        message: "Replace 'YOUR_CHAT_ID' with your actual Telegram chat ID. You can get it by messaging @userinfobot on Telegram."
      });
    }

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
    
    // Handle common Telegram API errors more gracefully
    if (error.response && error.response.data) {
      const telegramError = error.response.data;
      
      // Chat not found error
      if (telegramError.error_code === 400 && telegramError.description.includes("chat not found")) {
        return res.status(400).json({
          error: "Invalid chat ID",
          message: "The provided chat ID doesn't exist or the bot doesn't have permission to send messages to this chat.",
          details: telegramError
        });
      }
    }
    
    return res.status(500).json({
      error: "Failed to send test message",
      details: error.message,
      response: error.response?.data
    });
  }
}
