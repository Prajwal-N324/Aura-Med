import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

const MODELS = ["gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-1.5-flash"];

export async function analyzeSymptoms(symptoms: string, location: string = "India") {
  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
        }
      });

      const prompt = `
        Perform clinical analysis of: "${symptoms}" in ${location}.
        Return ONLY valid JSON. Structure:
        {
          "diseases": [{"name": "string", "probability": "string"}],
          "hospitals": [{"name": "string", "location": "string", "type": "string"}],
          "treatment_options": [{"category": "string", "estimated_cost": "string", "description": "string"}],
          "gemini_thoughts": [{"point": "string", "detail": "string"}],
          "model_interpretation": "string",
          "advice": "string"
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Safety: Extract JSON if AI includes markdown wrappers
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const cleanJson = jsonMatch ? jsonMatch[0] : text;
      
      return JSON.parse(cleanJson);

    } catch (error: any) {
      console.warn(`[AI-SYNC] ${modelName} Failure:`, error.message);
      continue;
    }
  }

  return { error: "Neural Link Latency. Please check your connection and retry." };
}

export async function getSimulationReasoning(drugs: any[]) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-lite",
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.1
      }
    });

    const prompt = `Analyze drug interaction: ${JSON.stringify(drugs)}. JSON: {"reasoning": "1-2 sentence clinical insight."}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : text).reasoning;
  } catch (error) {
    return "Analyzing organ clearance models...";
  }
}
