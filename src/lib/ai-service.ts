import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

// Quota-Friendly Stack: Prioritizing High-Limit Flash models for stability
const MODELS = ["gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-2.0-flash-lite"];

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

export async function analyzeSymptoms(symptoms: string, location: string = "India") {
  // 1. Neural Cache Check (Local)
  try {
    const cacheKey = `aura_med_cache_${btoa(symptoms.toLowerCase().trim()).substring(0, 32)}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      console.log("[Aura Med] Neural Cache Hit. Restoring previous analysis...");
      return JSON.parse(cached);
    }
  } catch (e) { /* LocalStorage not available */ }

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1, // Fast and deterministic
        },
        safetySettings
      });

      const prompt = `
        As an AI Medical Consultant in India, analyze symptoms: "${symptoms}" in ${location}.
        Return ONLY JSON:
        {
          "diseases": [{"name": "string", "probability": "High/Medium/Low"}],
          "hospitals": [{"name": "string (e.g. Apollo, AIIMS)", "location": "string", "type": "string"}],
          "treatment_options": [{"category": "string", "estimated_cost": "₹X - ₹Y", "description": "string"}],
          "gemini_thoughts": [{"point": "Observation", "detail": "Reasoning with **bold highlights**."}],
          "model_interpretation": "Actionable conclusion with **Solution**.",
          "advice": "Disclaimer."
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const data = JSON.parse(jsonMatch ? jsonMatch[0] : text);

      // 2. Save to Neural Cache
      try {
        const cacheKey = `aura_med_cache_${btoa(symptoms.toLowerCase().trim()).substring(0, 32)}`;
        localStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (e) {}

      return data;

    } catch (error: any) {
      console.warn(`[Aura Med] ${modelName} Quota/Failure:`, error.message);
      continue;
    }
  }

  return { error: "Neural Intelligence Quota Exceeded. Please wait 60 seconds and retry analysis." };
}

export async function getSimulationReasoning(drugs: any[]) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.1
      },
      safetySettings
    });

    const prompt = `Pharmacokinetic analysis for: ${JSON.stringify(drugs)}. Return JSON: {"reasoning": "Clinical insight with **bold highlights**."}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : text).reasoning;
  } catch (error) {
    return "Optimizing neural clearance models...";
  }
}
