import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { employer_id } = req.query;
  
  if (!employer_id) {
    return res.status(400).json({ error: "Missing employer_id parameter" });
  }

  try {
    // Update the employer record to enable Telegram
    const { data, error } = await supabase
      .from("employers")
      .update({ 
        telegram_enabled: true,
        telegram_bot_username: "Radojobs_bot"  // Use your actual bot username
      })
      .eq("id", employer_id)
      .select();
    
    if (error) throw error;
    
    return res.status(200).json({
      message: "Telegram integration enabled successfully",
      data
    });
  } catch (error) {
    console.error("Error enabling Telegram integration:", error);
    return res.status(500).json({ error: "Failed to enable Telegram integration" });
  }
}
