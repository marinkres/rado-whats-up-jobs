import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export default async function handler(req, res) {
  // Set proper content-type header for JSON
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { job_id } = req.query;
  
  if (!job_id) {
    return res.status(400).json({ error: "Missing job_id parameter" });
  }

  try {
    // First, validate that the job exists
    const { data: job, error } = await supabase
      .from("job_listings")
      .select("id, title")
      .eq("id", job_id)
      .single();
    
    if (error || !job) {
      return res.status(404).json({ error: "Job not found" });
    }
    
    // Get Telegram bot username - use environment variable or fallback to a default
    const botUsername = process.env.TELEGRAM_BOT_USERNAME || "Radojobs_bot";
    
    // Generate a deep link for Telegram
    const telegramLink = `https://t.me/${botUsername}?start=${job_id}`;
    
    console.log(`Generated Telegram link for job ${job_id}: ${telegramLink}`);
    
    // Return JSON response with proper stringify
    return res.status(200).json({ 
      telegramLink,
      jobId: job_id,
      jobTitle: job.title
    });
  } catch (error) {
    console.error("Error generating Telegram deep link:", error);
    
    // Even if there's an error, still return a valid JSON response
    const botUsername = process.env.TELEGRAM_BOT_USERNAME || "Radojobs_bot";
    const fallbackLink = `https://t.me/${botUsername}?start=${job_id}`;
    
    return res.status(200).json({
      telegramLink: fallbackLink,
      jobId: job_id,
      jobTitle: "Job Listing",
      note: "Using fallback link due to error"
    });
  }
}

// Helper function to get bot username if not set in environment
async function getBotUsername(token) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error('Failed to get bot info');
    }
    
    return data.result.username;
  } catch (error) {
    console.error("Failed to get bot username:", error);
    return "your_bot"; // Fallback
  }
}
