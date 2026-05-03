import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import Groq from "groq-sdk";
import OpenAI from "openai";

// 1. Initialize Neural Links
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || "NA", dangerouslyAllowBrowser: true });
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "NA", dangerouslyAllowBrowser: true });

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

export async function analyzeSymptoms(symptoms: string, location: string = "India") {
  // 1. Local Neural Cache Check
  try {
    const cacheKey = `aura_med_cache_${btoa(symptoms.toLowerCase().trim()).substring(0, 32)}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (e) {}

  const prompt = `
    As a Senior Clinical Intelligence Engine, analyze: "${symptoms}" in ${location}.
    Return EXCLUSIVELY a JSON object:
    {
      "diseases": [{"name": "string", "probability": "High/Medium/Low"}],
      "hospitals": [{"name": "Apollo/Manipal/AIIMS", "location": "string", "type": "string"}],
      "treatment_options": [{"category": "string", "estimated_cost": "₹X", "description": "string"}],
      "gemini_thoughts": [{"point": "Observation", "detail": "Reasoning with **bold**."}],
      "model_interpretation": "Actionable Solution.",
      "advice": "Disclaimer."
    }
  `;

  // 2. Intelligence Failover Loop
  // Order: Gemini (1.5 Flash) -> Groq (Llama 3.1) -> OpenAI (GPT-4o-mini)
  
  // -- ATTEMPT 1: GEMINI --
  try {
    console.log("[Aura Med] Attempting Gemini Neural Link...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings });
    const result = await model.generateContent(prompt);
    const data = JSON.parse(result.response.text().match(/\{[\s\S]*\}/)?.[0] || result.response.text());
    saveToCache(symptoms, data);
    return data;
  } catch (e: any) {
    console.warn("[Aura Med] Gemini Link Interrupted:", e.message);
  }

  // -- ATTEMPT 2: GROQ (Llama 3.1) --
  if (process.env.NEXT_PUBLIC_GROQ_API_KEY) {
    try {
      console.log("[Aura Med] Failover: Connecting to Groq High-Speed Link (Llama 3.1)...");
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-70b-versatile",
        response_format: { type: "json_object" }
      });
      const data = JSON.parse(chatCompletion.choices[0].message.content || "{}");
      saveToCache(symptoms, data);
      return data;
    } catch (e: any) {
      console.warn("[Aura Med] Groq Link Interrupted:", e.message);
    }
  }

  // -- ATTEMPT 3: OPENAI --
  if (process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    try {
      console.log("[Aura Med] Failover: Connecting to OpenAI Standard Link (GPT-4o)...");
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini",
        response_format: { type: "json_object" }
      });
      const data = JSON.parse(completion.choices[0].message.content || "{}");
      saveToCache(symptoms, data);
      return data;
    } catch (e: any) {
      console.warn("[Aura Med] OpenAI Link Interrupted:", e.message);
    }
  }

  return { error: "Global Intelligence Outage. All neural links (Gemini, Groq, OpenAI) are currently unavailable." };
}

function saveToCache(symptoms: string, data: any) {
  try {
    const cacheKey = `aura_med_cache_${btoa(symptoms.toLowerCase().trim()).substring(0, 32)}`;
    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (e) {}
}

export async function getSimulationReasoning(drugs: any[]) {
  const prompt = `Pharmacokinetic analysis for: ${JSON.stringify(drugs)}. Return JSON: {"reasoning": "Clinical insight with **bold highlights**."}`;
  
  // Rapid Failover for Simulation
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings });
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text().match(/\{[\s\S]*\}/)?.[0] || result.response.text()).reasoning;
  } catch (e) {
    if (process.env.NEXT_PUBLIC_GROQ_API_KEY) {
      const chat = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" }
      });
      return JSON.parse(chat.choices[0].message.content || "{}").reasoning;
    }
    return "Analyzing systemic physiological impact...";
  }
}
