import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Set CORS headers if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests (OPTIONS method)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Allow both query params and body for flexibility
  const employer_id = req.query.employer_id || (req.body && req.body.employer_id);
  const employer_email = req.query.email || (req.body && req.body.email);
  
  if (!employer_id && !employer_email) {
    return res.status(400).json({ error: "Missing employer_id or email parameter" });
  }

  try {
    let updateQuery = supabase
      .from("employers")
      .update({ 
        telegram_enabled: true,
        telegram_bot_username: "Radojobs_bot"
      });
    
    // Apply the appropriate filter
    if (employer_id) {
      updateQuery = updateQuery.eq("id", employer_id);
    } else {
      updateQuery = updateQuery.eq("email", employer_email);
    }
    
    // Execute the query
    const { data, error } = await updateQuery.select();
    
    if (error) throw error;
    
    // Add an additional query to check the schema of the employers table
    const { data: schemaData, error: schemaError } = await supabase
      .rpc('debug_get_table_info', { table_name: 'employers' });
    
    return res.status(200).json({
      message: "Telegram integration enabled successfully",
      data,
      schema: schemaError ? null : schemaData
    });
  } catch (error) {
    console.error("Error enabling Telegram integration:", error);
    return res.status(500).json({ 
      error: "Failed to enable Telegram integration",
      details: error.message
    });
  }
}
