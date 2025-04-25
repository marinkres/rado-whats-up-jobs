import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const MESSAGES = {
  hr: {
    welcome: "Bok! Ja sam Rado 🤖\nZa nastavak odaberi jezik (choose language):\n1️⃣ Hrvatski\n2️⃣ English",
    askName: "Kako se zoveš? (ime i prezime)",
    askLanguages: "Koje jezike govoriš?",
    askAvailability: "Kada si dostupan za rad?",
    askExperience: "Imaš li prethodnog iskustva? Ukratko opiši.",
    thanks: "Hvala na prijavi! Poslodavac će te kontaktirati čim prije. Sretno! 🍀",
  },
  en: {
    welcome: "Hi! I'm Rado 🤖\nPlease choose your language:\n1️⃣ Hrvatski\n2️⃣ English",
    askName: "What's your full name?",
    askLanguages: "Which languages do you speak?",
    askAvailability: "When are you available to work?",
    askExperience: "Do you have previous experience? Briefly describe.",
    thanks: "Thank you for applying! The employer will contact you soon. Good luck! 🍀",
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const update = req.body;
  
  // Telegram webhook verification
  if (!update || !update.message) {
    return res.status(200).send("OK");
  }

  const chatId = update.message.chat.id;
  const telegramId = chatId.toString();
  const body = update.message.text || "";
  const firstName = update.message.from.first_name || "";
  const lastName = update.message.from.last_name || "";
  const username = update.message.from.username || "";

  // 1. Find candidate by Telegram ID
  let { data: candidates, error: candidateError } = await supabase
    .from("candidates")
    .select("*")
    .eq("telegram_id", telegramId)
    .limit(1);

  let candidate_id;
  let candidate = candidates && candidates.length > 0 ? candidates[0] : null;

  // 2. Check for deep link parameters when bot is started with /start command
  let jobId = null;
  const startCommand = body.match(/^\/start\s+(.+)$/i);
  
  if (startCommand) {
    // Extract job ID from deep link parameter
    jobId = startCommand[1];
    
    // Create candidate if doesn't exist
    if (!candidate) {
      const { data: newCandidate, error: newCandidateError } = await supabase
        .from("candidates")
        .insert([{ 
          telegram_id: telegramId, 
          name: `${firstName} ${lastName}`.trim() || username || "", 
          created_at: new Date().toISOString() 
        }])
        .select();
      
      if (newCandidateError || !newCandidate || newCandidate.length === 0) {
        console.error("Supabase newCandidateError:", newCandidateError);
        return res.status(500).send("Supabase error (candidate insert)");
      }
      candidate = newCandidate[0];
    }
    candidate_id = candidate.id;
    
    // Process as if it was a PRIJAVA:jobId command
    await handlePrijava(jobId, candidate_id, candidate, telegramId, chatId, body, res);
    return;
  }

  // 3. Handle "PRIJAVA" or "PRIJAVA:{job_id}" command
  let prijavaMatch = body.toUpperCase().match(/^PRIJAVA(?::([A-Z0-9-]+))?$/i);
  if (prijavaMatch) {
    prijavaJobId = prijavaMatch[1] ? prijavaMatch[1] : null;
    
    if (!candidate) {
      const { data: newCandidate, error: newCandidateError } = await supabase
        .from("candidates")
        .insert([{ 
          telegram_id: telegramId, 
          name: `${firstName} ${lastName}`.trim() || username || "", 
          created_at: new Date().toISOString() 
        }])
        .select();
      if (newCandidateError || !newCandidate || newCandidate.length === 0) {
        console.error("Supabase newCandidateError:", newCandidateError);
        return res.status(500).send("Supabase error (candidate insert)");
      }
      candidate = newCandidate[0];
    }
    candidate_id = candidate.id;

    await handlePrijava(prijavaJobId, candidate_id, candidate, telegramId, chatId, body, res);
    return;
  }

  // 4. If candidate exists, handle onboarding
  if (candidate) {
    candidate_id = candidate.id;

    // Find latest conversation
    let { data: conversations } = await supabase
      .from("conversations")
      .select("id")
      .eq("candidate_id", candidate_id)
      .order("created_at", { ascending: false })
      .limit(1);
    const conversation_id = conversations && conversations.length > 0 ? conversations[0].id : null;

    // Save message
    await supabase.from("messages").insert([
      {
        conversation_id,
        sender: "candidate",
        content: body,
        sent_at: new Date().toISOString(),
      },
    ]);

    // 3a. Language selection
    if (!candidate.language_choice) {
      let lang = null;
      if (body === "1" || body.toLowerCase() === "hr" || body.toLowerCase() === "hrvatski") lang = "hr";
      if (body === "2" || body.toLowerCase() === "en" || body.toLowerCase() === "english") lang = "en";
      if (!lang) {
        // Ask for language again
        try {
          await sendTelegramMessage(chatId, MESSAGES.hr.welcome);
        } catch (err) {
          console.error("Telegram send error:", err);
        }
        return res.status(200).send("OK");
      }
      await supabase.from("candidates").update({ language_choice: lang }).eq("id", candidate_id);
      
      try {
        await sendTelegramMessage(chatId, MESSAGES[lang].askName);
      } catch (err) {
        console.error("Telegram send error:", err);
      }
      return res.status(200).send("OK");
    }

    const lang = candidate.language_choice || "hr";

    // 3b. Name input
    if (!candidate.name) {
      await supabase.from("candidates").update({ name: body }).eq("id", candidate_id);
      try {
        await sendTelegramMessage(chatId, MESSAGES[lang].askLanguages);
      } catch (err) {
        console.error("Telegram send error:", err);
      }
      return res.status(200).send("OK");
    }

    // 3c. Languages input
    if (!candidate.languages) {
      await supabase.from("candidates").update({ languages: body }).eq("id", candidate_id);
      try {
        await sendTelegramMessage(chatId, MESSAGES[lang].askAvailability);
      } catch (err) {
        console.error("Telegram send error:", err);
      }
      return res.status(200).send("OK");
    }

    // 3d. Availability input
    if (!candidate.availability) {
      await supabase.from("candidates").update({ availability: body }).eq("id", candidate_id);
      try {
        await sendTelegramMessage(chatId, MESSAGES[lang].askExperience);
      } catch (err) {
        console.error("Telegram send error:", err);
      }
      return res.status(200).send("OK");
    }

    // 3e. Experience input
    if (!candidate.experience) {
      await supabase.from("candidates").update({ experience: body }).eq("id", candidate_id);
      try {
        await sendTelegramMessage(chatId, MESSAGES[lang].thanks);
      } catch (err) {
        console.error("Telegram send error:", err);
      }
      return res.status(200).send("OK");
    }

    // If all fields are filled, send a generic message
    return res.status(200).send("OK");
  }

  // If no candidate found and not "PRIJAVA" command or /start
  try {
    await sendTelegramMessage(
      chatId,
      "Za prijavu na posao, pošalji poruku s tekstom 'PRIJAVA' ili 'PRIJAVA:[ID posla]'"
    );
  } catch (err) {
    console.error("Telegram send error:", err);
  }
  return res.status(200).send("OK");
}

// Helper function to handle job applications
async function handlePrijava(jobId, candidate_id, candidate, telegramId, chatId, body, res) {
  // Get job title and company name
  let jobTitle = "";
  let companyName = "";
  if (jobId) {
    const { data: job } = await supabase
      .from("job_listings")
      .select("title, employer_id")
      .eq("id", jobId)
      .single();
    
    if (job) {
      jobTitle = job.title || "";
      if (job.employer_id) {
        const { data: employer } = await supabase
          .from("employers")
          .select("company_name")
          .eq("id", job.employer_id)
          .single();
        if (employer) {
          companyName = employer.company_name || "";
        }
      }
    }
  }

  // Check if conversation already exists
  let conversation_id = null;
  if (jobId) {
    const { data: existingConv } = await supabase
      .from("conversations")
      .select("id")
      .eq("candidate_id", candidate_id)
      .eq("job_id", jobId)
      .order("created_at", { ascending: false })
      .limit(1);
    if (existingConv && existingConv.length > 0) {
      conversation_id = existingConv[0].id;
    }
  }
  
  // If no conversation exists, create one
  if (!conversation_id) {
    const { data: newConv } = await supabase
      .from("conversations")
      .insert([{ 
        candidate_id, 
        job_id: jobId, 
        created_at: new Date().toISOString(),
        channel: "telegram"
      }])
      .select();
    conversation_id = newConv && newConv.length > 0 ? newConv[0].id : null;
  }

  // Save message
  await supabase.from("messages").insert([
    {
      conversation_id,
      sender: "candidate",
      content: body,
      sent_at: new Date().toISOString(),
    },
  ]);

  // Create application record if not exists
  if (jobId && candidate_id) {
    const { data: existingApp } = await supabase
      .from("applications")
      .select("id")
      .eq("candidate_id", candidate_id)
      .eq("job_id", jobId)
      .limit(1);
    
    if (!existingApp || existingApp.length === 0) {
      await supabase
        .from("applications")
        .insert([
          {
            candidate_id,
            job_id: jobId,
            status: "pending",
            created_at: new Date().toISOString(),
            message: "Prijava putem Telegrama",
          },
        ]);
    }
  }

  // Welcome message with job and company info
  let welcomeMsg = MESSAGES.hr.welcome;
  if (jobTitle || companyName) {
    welcomeMsg =
      `Bok! Ja sam Rado 🤖\nPrijava za posao: ${jobTitle || "-"}${companyName ? ` u tvrtki: ${companyName}` : ""}\n\nZa nastavak odaberi jezik (choose language):\n1️⃣ Hrvatski\n2️⃣ English`;
  }

  try {
    await sendTelegramMessage(chatId, welcomeMsg);
  } catch (err) {
    console.error("Telegram send error:", err);
  }
  return res.status(200).send("OK");
}

async function sendTelegramMessage(chatId, text) {
  const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await axios.post(apiUrl, {
    chat_id: chatId,
    text: text
  });
}
