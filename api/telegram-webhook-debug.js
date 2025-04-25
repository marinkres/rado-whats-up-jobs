import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Always allow OPTIONS requests for CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }
  
  // Log complete request information
  console.log("Telegram Debug - Request Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Telegram Debug - Request Body:", JSON.stringify(req.body, null, 2));
  console.log("Telegram Debug - Query Parameters:", JSON.stringify(req.query, null, 2));
  
  // Store the webhook request data in the database for inspection
  try {
    await supabase
      .from("telegram_debug_logs")
      .insert([
        {
          headers: req.headers,
          body: req.body,
          query: req.query,
          timestamp: new Date().toISOString(),
          ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
        }
      ]);
  } catch (error) {
    console.error("Failed to log webhook data:", error);
  }

  // Always respond with 200 OK to Telegram
  return res.status(200).json({ status: "ok", message: "Debug information logged" });
}
