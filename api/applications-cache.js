import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

let cache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 1000; // 1 minuta

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const now = Date.now();
  if (cache && now - cacheTimestamp < CACHE_TTL) {
    return res.status(200).json({ data: cache, cached: true });
  }

  const { data, error } = await supabase
    .from("conversations")
    .select(`
      id,
      created_at,
      candidate_id,
      job_id,
      candidates (
        id,
        name,
        phone
      ),
      job_listings (
        id,
        title
      )
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  cache = data;
  cacheTimestamp = now;
  return res.status(200).json({ data, cached: false });
}
