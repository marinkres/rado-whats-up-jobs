import axios from "axios";

export default async function handler(req, res) {
  // Always secure API endpoints
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!TELEGRAM_BOT_TOKEN) {
    return res.status(500).json({
      error: "Bot token not found in environment variables",
      env_vars: Object.keys(process.env).filter(key => 
        !key.toLowerCase().includes('key') && 
        !key.toLowerCase().includes('secret') && 
        !key.toLowerCase().includes('password') && 
        !key.toLowerCase().includes('token')
      ).join(', '),
      // Note: We don't expose full env vars for security reasons
    });
  }

  try {
    // Test the bot token by calling getMe
    const getMeUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`;
    const response = await axios.get(getMeUrl);
    
    if (!response.data?.ok) {
      return res.status(400).json({
        error: "Invalid bot token",
        botResponse: response.data
      });
    }
    
    return res.status(200).json({
      message: "Bot token is valid",
      botInfo: response.data.result,
      tokenFirstChars: TELEGRAM_BOT_TOKEN.substring(0, 5) + '...' + TELEGRAM_BOT_TOKEN.substring(TELEGRAM_BOT_TOKEN.length - 3)
    });
  } catch (error) {
    console.error("Error verifying bot token:", error);
    return res.status(500).json({
      error: "Failed to verify bot token",
      details: error.message,
      response: error.response?.data
    });
  }
}
