const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`);
    const data = await response.json();
    
    if (data.error) {
      console.error("API Error:", data.error.message);
      return;
    }

    console.log("Generation Models Available:");
    data.models
      .filter(m => m.supportedGenerationMethods.includes("generateContent"))
      .forEach(m => {
        console.log(`- ${m.name}`);
      });
  } catch (err) {
    console.error("Connection Error:", err.message);
  }
}

listModels();
