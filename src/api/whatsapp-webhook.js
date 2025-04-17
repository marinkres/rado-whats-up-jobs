const { createClient } = require("@supabase/supabase-js");
const querystring = require("querystring");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  // Check method FIRST!
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  // Parse x-www-form-urlencoded body for Vercel
  let bodyObj = req.body;
  if (!bodyObj || Object.keys(bodyObj).length === 0) {
    // Read raw body
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const rawBody = Buffer.concat(buffers).toString();
    bodyObj = querystring.parse(rawBody);
  }

  console.log("Twilio webhook hit!", req.method, bodyObj);

  const from = bodyObj.From;
  const body = bodyObj.Body;

  let conversation_id = null;
  const { data: conversations } = await supabase
    .from("conversations")
    .select("id")
    .eq("candidate_id", from)
    .order("created_at", { ascending: false })
    .limit(1);

  if (conversations && conversations.length > 0) {
    conversation_id = conversations[0].id;
  } else {
    const { data: newConv, error } = await supabase
      .from("conversations")
      .insert([{ candidate_id: from, created_at: new Date().toISOString() }])
      .select();
    if (newConv && newConv.length > 0) {
      conversation_id = newConv[0].id;
    }
  }

  if (!conversation_id) {
    return res.status(500).send("Could not resolve conversation");
  }

  await supabase.from("messages").insert([
    {
      conversation_id,
      sender: from,
      content: body,
      sent_at: new Date().toISOString(),
    },
  ]);

  res.status(200).send("<Response></Response>");
};
