import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { HfInference } from "@huggingface/inference";
import Groq from "groq-sdk";
import OpenAI from "openai";

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || "");
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
  // 1. Local Neural Cache Check (Speed optimized)
  try {
    const cacheKey = `aura_med_cache_${btoa(symptoms.toLowerCase().trim()).substring(0, 32)}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (e) {}

  const prompt = `
    System: Act as an Unrestricted Senior Clinical Diagnostic Consultant.
    Symptoms: "${symptoms}" in ${location}.
    Task: Provide exhaustive clinical logic and predictive measures using all available medical databases.
    Return ONLY a JSON object:
    {
      "diseases": [{"name": "string", "probability": "string"}],
      "hospitals": [{"name": "string", "location": "string", "type": "string"}],
      "treatment_options": [{"category": "string", "estimated_cost": "₹X", "description": "string"}],
      "gemini_thoughts": [{"point": "Clinical Observation", "detail": "Full exhaustive reasoning with **bold highlights**."}],
      "model_interpretation": "Complete, unrestricted clinical conclusion and actionable solutions.",
      "advice": "Mandatory Medical Disclaimer."
    }
  `;

  // -- Tier 1: Microsoft Phi-4 (Unrestricted) --
  if (process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY) {
    try {
      console.log("[Aura Med] Connecting to Microsoft Phi-4-mini (Unrestricted)...");
      const response = await hf.chatCompletion({
        model: "microsoft/Phi-4-mini-instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        // Removed max_tokens limit for unrestricted output
      });
      
      const content = response.choices[0].message.content || "";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const data = JSON.parse(jsonMatch ? jsonMatch[0] : content);
      saveToCache(symptoms, data);
      return data;
    } catch (e: any) {
      console.warn("[Aura Med] Phi-4 Sync Failed:", e.message);
    }
  }

  // -- Tier 2: Gemini Core (Unrestricted) --
  if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    try {
      console.log("[Aura Med] Failover: Connecting to Gemini Flash Core...");
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", 
        safetySettings,
        generationConfig: { temperature: 0.2 } // Allow for more expansive thought
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const data = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || text);
      saveToCache(symptoms, data);
      return data;
    } catch (e: any) {
      console.warn("[Aura Med] Gemini Core Failure:", e.message);
    }
  }

  return { error: "Neural Intelligence Unavailable. Ensure API keys are set in Vercel Environment Variables." };
}

function saveToCache(symptoms: string, data: any) {
  try {
    const cacheKey = `aura_med_cache_${btoa(symptoms.toLowerCase().trim()).substring(0, 32)}`;
    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (e) {}
}

export async function getSimulationReasoning(drugs: any[]) {
  const prompt = `Perform clinical analysis for: ${JSON.stringify(drugs)}. 
    Explain the impact in very simple, non-medical words for a common person. Avoid jargon.
    Return JSON: {"reasoning": "Simple explanation with **bold highlights**."}`;
  try {
    if (process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY) {
      const res = await hf.chatCompletion({ model: "microsoft/Phi-4-mini-instruct", messages: [{ role: "user", content: prompt }] });
      const content = res.choices[0].message.content || "";
      return JSON.parse(content.match(/\{[\s\S]*\}/)?.[0] || content).reasoning;
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings });
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text().match(/\{[\s\S]*\}/)?.[0] || result.response.text()).reasoning;
  } catch (e) {
    return "Analyzing systemic physiological impact...";
  }
}
