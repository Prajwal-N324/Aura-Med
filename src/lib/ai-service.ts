import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

// Restoring the High-Fidelity Intelligence Stack
const MODELS = ["gemini-2.0-flash", "gemini-pro-latest", "gemini-1.5-pro"];

// Professional Medical Safety Configuration: Ensuring clinical queries aren't blocked
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

export async function analyzeSymptoms(symptoms: string, location: string = "India") {
  for (const modelName of MODELS) {
    try {
      console.log(`[Aura Med] Connecting to High-Fidelity Model: ${modelName}...`);
      
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2, // Slightly higher for more nuanced reasoning
        },
        safetySettings
      });

      const prompt = `
        As a Senior Medical Intelligence Consultant in India, perform an exhaustive analysis of: "${symptoms}" in the context of ${location}.
        
        Provide high-fidelity clinical insights including specific Indian hospital networks and accurate treatment tiers in INR (₹).
        
        Return EXCLUSIVELY a JSON object:
        {
          "diseases": [{"name": "string", "probability": "High/Medium/Low"}],
          "hospitals": [{"name": "string (e.g. Apollo, Manipal)", "location": "string", "type": "string"}],
          "treatment_options": [{"category": "string (e.g. Premium Private)", "estimated_cost": "₹X - ₹Y", "description": "string"}],
          "gemini_thoughts": [{"point": "Clinical Observation", "detail": "Deep reasoning with **bold highlights**."}],
          "model_interpretation": "Comprehensive Actionable Conclusion with **Solution**.",
          "advice": "Mandatory Medical Disclaimer."
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const cleanJson = jsonMatch ? jsonMatch[0] : text;
      
      const parsedData = JSON.parse(cleanJson);
      console.log(`[Aura Med] ${modelName} Analysis Complete.`);
      return parsedData;

    } catch (error: any) {
      console.error(`[Aura Med] ${modelName} Intelligence Failure:`, error.message);
      continue;
    }
  }

  return { error: "Neural Intelligence Link Failed. This usually occurs due to API Quota or Safety Overrides. Please check your Gemini API Key." };
}

export async function getSimulationReasoning(drugs: any[]) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.1
      },
      safetySettings
    });

    const prompt = `Perform Pharmacokinetic analysis: ${JSON.stringify(drugs)}. Return JSON: {"reasoning": "Detailed clinical insight with **bold highlights**."}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : text).reasoning;
  } catch (error) {
    return "Synchronizing neural clearance models...";
  }
}
