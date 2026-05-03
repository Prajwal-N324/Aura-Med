import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { HfInference } from "@huggingface/inference";
import Groq from "groq-sdk";
import OpenAI from "openai";

// 1. Initialize Multi-Neural Gateway
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
  // 1. Neural Cache Check
  try {
    const cacheKey = `aura_med_cache_${btoa(symptoms.toLowerCase().trim()).substring(0, 32)}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (e) {}

  const prompt = `
    System: Act as a Senior Clinical Diagnostic Engine using Phi-4 (3.8B) logic.
    User Symptoms: "${symptoms}" in ${location}.
    Task: Apply actual clinical logic and ICD-10 patterns from open-source medical databases.
    Return ONLY a JSON object:
    {
      "diseases": [{"name": "Condition", "probability": "High/Medium/Low"}],
      "hospitals": [{"name": "Facility Name", "location": "Area", "type": "Specialty"}],
      "treatment_options": [{"category": "Tier", "estimated_cost": "₹X", "description": "Clinical Suggestion"}],
      "gemini_thoughts": [{"point": "Clinical Logic", "detail": "Phi-4 reasoning based on open clinical data."}],
      "model_interpretation": "Predictive measure and actionable clinical solution.",
      "advice": "Mandatory Medical Disclaimer."
    }
  `;

  // 2. Intelligence Chain: Phi-4 (Primary) -> Gemini -> Groq
  
  // -- Tier 1: Microsoft Phi-4-mini (via Hugging Face) --
  if (process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY) {
    try {
      console.log("[Aura Med] Connecting to Microsoft Phi-4-mini (3.8B) Intelligence Link...");
      const response = await hf.chatCompletion({
        model: "microsoft/Phi-4-mini-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.1,
      });
      const data = JSON.parse(response.choices[0].message.content?.match(/\{[\s\S]*\}/)?.[0] || response.choices[0].message.content || "{}");
      saveToCache(symptoms, data);
      return data;
    } catch (e: any) {
      console.warn("[Aura Med] Phi-4 Link Interrupted:", e.message);
    }
  }

  // -- Tier 2: Gemini Failover --
  try {
    console.log("[Aura Med] Failover: Connecting to Gemini Flash...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings });
    const result = await model.generateContent(prompt);
    const data = JSON.parse(result.response.text().match(/\{[\s\S]*\}/)?.[0] || result.response.text());
    saveToCache(symptoms, data);
    return data;
  } catch (e: any) {
    console.warn("[Aura Med] Gemini Link Interrupted:", e.message);
  }

  // -- Tier 3: Groq Failover --
  if (process.env.NEXT_PUBLIC_GROQ_API_KEY) {
    try {
      const chat = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-70b-versatile",
        response_format: { type: "json_object" }
      });
      const data = JSON.parse(chat.choices[0].message.content || "{}");
      saveToCache(symptoms, data);
      return data;
    } catch (e: any) {}
  }

  return { error: "Intelligence Link Failed. Please verify your API keys in .env.local" };
}

function saveToCache(symptoms: string, data: any) {
  try {
    const cacheKey = `aura_med_cache_${btoa(symptoms.toLowerCase().trim()).substring(0, 32)}`;
    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (e) {}
}

export async function getSimulationReasoning(drugs: any[]) {
  const prompt = `Pharmacokinetic analysis: ${JSON.stringify(drugs)}. Return JSON: {"reasoning": "Phi-4 Insight."}`;
  try {
    if (process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY) {
      const res = await hf.chatCompletion({
        model: "microsoft/Phi-4-mini-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200
      });
      return JSON.parse(res.choices[0].message.content?.match(/\{[\s\S]*\}/)?.[0] || res.choices[0].message.content || "{}").reasoning;
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings });
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text().match(/\{[\s\S]*\}/)?.[0] || result.response.text()).reasoning;
  } catch (e) {
    return "Optimizing systemic physiological impact...";
  }
}
