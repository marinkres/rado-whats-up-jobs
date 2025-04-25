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

  console.log("Received Telegram webhook:", JSON.stringify(req.body, null, 2));

  // First check if Telegram integration is enabled globally
  try {
    const { data: settings, error: settingsError } = await supabase
      .from("settings")
      .select("telegram_enabled")
      .single();
    
    if (settingsError) {
      console.error("Error checking global Telegram settings:", settingsError);
    } else if (!settings?.telegram_enabled) {
      console.warn("Telegram integration is globally disabled");
      return res.status(200).send("Telegram integration is disabled");
    }
  } catch (error) {
    console.error("Error checking global settings:", error);
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

  console.log(`Received message from user ${telegramId}: ${body}`);

  // 1. Find candidate by Telegram ID
  let { data: candidates, error: candidateError } = await supabase
    .from("candidates")
    .select("*")
    .eq("telegram_id", telegramId)
    .limit(1);

  if (candidateError) {
    console.error("Error fetching candidate:", candidateError);
    return res.status(500).send("Database error");
  }

  let candidate_id;
  let candidate = candidates && candidates.length > 0 ? candidates[0] : null;

  // 2. Check for deep link parameters when bot is started with /start command
  let jobId = null;
  const startCommand = body.match(/^\/start\s+(.+)$/i);
  
  if (startCommand) {
    // Extract job ID from deep link parameter
    jobId = startCommand[1];
    console.log(`Start command detected with job ID: ${jobId}`);
    
    // Create candidate if doesn't exist
    if (!candidate) {
      console.log(`Creating new candidate for telegram ID: ${telegramId}`);
      const { data: newCandidate, error: newCandidateError } = await supabase
        .from("candidates")
        .insert([{ 
          telegram_id: telegramId, 
          name: `${firstName} ${lastName}`.trim() || username || "", 
          created_at: new Date().toISOString() 
        }])
        .select();
      
      if (newCandidateError) {
        console.error("Supabase newCandidateError:", newCandidateError);
        return res.status(500).send("Supabase error (candidate insert)");
      }
      
      if (!newCandidate || newCandidate.length === 0) {
        console.error("No candidate was created");
        return res.status(500).send("Failed to create candidate");
      }
      
      candidate = newCandidate[0];
      console.log(`New candidate created with ID: ${candidate.id}`);
    }
    
    candidate_id = candidate.id;
    
    // Process as if it was a PRIJAVA:jobId command
    try {
      await handlePrijava(jobId, candidate_id, candidate, telegramId, chatId, body, res);
      console.log(`Successfully processed job application for job ID: ${jobId}`);
    } catch (error) {
      console.error("Error processing job application:", error);
      await sendTelegramMessage(chatId, "Došlo je do greške prilikom obrade prijave. Molimo pokušajte ponovno.");
    }
    return res.status(200).send("OK");
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
  console.log(`Beginning job application process for job ID: ${jobId}, candidate ID: ${candidate_id}`);
  
  try {
    // Get job details and check if the employer has Telegram enabled
    let jobTitle = "";
    let companyName = "";
    let telegramEnabled = false;
    
    if (jobId) {
      const { data: job, error } = await supabase
        .from("job_listings")
        .select("title, employer_id")
        .eq("id", jobId)
        .single();
      
      if (error) {
        console.error("Error fetching job details:", error);
      } else if (job) {
        jobTitle = job.title || "Nepoznati posao";
        
        if (job.employer_id) {
          const { data: employer, error: empError } = await supabase
            .from("employers")
            .select("company_name, telegram_enabled")
            .eq("id", job.employer_id)
            .single();
          
          if (empError) {
            console.error("Error fetching employer:", empError);
          } else if (employer) {
            companyName = employer.company_name || "";
            telegramEnabled = employer.telegram_enabled === true;
            
            if (!telegramEnabled) {
              console.warn(`Employer ${job.employer_id} has Telegram integration disabled`);
              await sendTelegramMessage(chatId, "Nažalost, poslodavac trenutno ne prima prijave putem Telegrama. Molimo kontaktirajte poslodavca drugim putem.");
              return res.status(200).send("OK");
            }
          }
        }
      }
    }

    console.log(`Job info retrieved - Title: ${jobTitle}, Company: ${companyName}`);

    // Check if conversation already exists
    let conversation_id = null;
    if (jobId) {
      const { data: existingConv, error } = await supabase
        .from("conversations")
        .select("id")
        .eq("candidate_id", candidate_id)
        .eq("job_id", jobId)
        .order("created_at", { ascending: false })
        .limit(1);
      
      if (error) {
        console.error("Error checking existing conversation:", error);
      } else if (existingConv && existingConv.length > 0) {
        conversation_id = existingConv[0].id;
        console.log(`Found existing conversation: ${conversation_id}`);
      }
    }
    
    // If no conversation exists, create one
    if (!conversation_id) {
      console.log("Creating new conversation");
      const { data: newConv, error } = await supabase
        .from("conversations")
        .insert([{ 
          candidate_id, 
          job_id: jobId, 
          created_at: new Date().toISOString(),
          channel: "telegram"
        }])
        .select();
      
      if (error) {
        console.error("Error creating conversation:", error);
        throw new Error("Failed to create conversation");
      }
      
      conversation_id = newConv && newConv.length > 0 ? newConv[0].id : null;
      console.log(`New conversation created with ID: ${conversation_id}`);
    }

    if (!conversation_id) {
      throw new Error("Failed to get or create conversation ID");
    }

    // Save message
    const { error: msgError } = await supabase.from("messages").insert([
      {
        conversation_id,
        sender: "candidate",
        content: body,
        sent_at: new Date().toISOString(),
      },
    ]);
    
    if (msgError) {
      console.error("Error saving message:", msgError);
    } else {
      console.log("Message saved to conversation");
    }

    // Create application record if not exists
    if (jobId && candidate_id) {
      console.log("Checking for existing application");
      const { data: existingApp, error: appCheckError } = await supabase
        .from("applications")
        .select("id")
        .eq("candidate_id", candidate_id)
        .eq("job_id", jobId)
        .limit(1);
      
      if (appCheckError) {
        console.error("Error checking application:", appCheckError);
      } else if (!existingApp || existingApp.length === 0) {
        console.log("Creating new application");
        const { error: appCreateError } = await supabase
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
        
        if (appCreateError) {
          console.error("Error creating application:", appCreateError);
        } else {
          console.log("New application created successfully");
        }
      } else {
        console.log(`Application already exists with ID: ${existingApp[0].id}`);
      }
    }

    // Welcome message with job and company info
    let welcomeMsg = MESSAGES.hr.welcome;
    if (jobTitle || companyName) {
      welcomeMsg =
        `Bok! Ja sam Rado 🤖\nPrijava za posao: ${jobTitle || "-"}${companyName ? ` u tvrtki: ${companyName}` : ""}\n\nZa nastavak odaberi jezik (choose language):\n1️⃣ Hrvatski\n2️⃣ English`;
    }

    console.log("Sending welcome message to user");
    await sendTelegramMessage(chatId, welcomeMsg);
    console.log("Welcome message sent");
    
  } catch (error) {
    console.error("Error in handlePrijava:", error);
    throw error; // Re-throw to be handled by the caller
  }
}

async function sendTelegramMessage(chatId, text) {
  try {
    console.log(`Sending message to chat ID: ${chatId}`);
    const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await axios.post(apiUrl, {
      chat_id: chatId,
      text: text
    });
    console.log("Message sent successfully:", response.data.ok);
    return response.data;
  } catch (error) {
    console.error("Error sending Telegram message:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
    throw error;
  }
}
