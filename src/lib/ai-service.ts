import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

// Optimized for Speed: Prioritizing Lite models for sub-second analysis
const MODELS = ["gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-1.5-flash"];

export async function analyzeSymptoms(symptoms: string, location: string = "India") {
  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1, // Lower temperature for faster, deterministic results
        }
      });

      const prompt = `
        Perform clinical analysis of symptoms: "${symptoms}" for location: "${location}".
        
        Return ONLY JSON:
        {
          "diseases": [{"name": "Condition", "probability": "High"}],
          "hospitals": [{"name": "Apollo/Manipal/AIIMS", "location": "Area", "type": "Specialty"}],
          "treatment_options": [{"category": "Tier", "estimated_cost": "₹X,XXX", "description": "Summary"}],
          "gemini_thoughts": [{"point": "Title", "detail": "Detail with **bold**."}],
          "model_interpretation": "Actionable Solution.",
          "advice": "Disclaimer."
        }
        Be concise. Use Markdown bolding.
      `;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      const response = await result.response;
      return JSON.parse(response.text());

    } catch (error: any) {
      console.warn(`${modelName} delay:`, error.message);
      continue;
    }
  }

  return { error: "Latency issues. Please retry." };
}

export async function getSimulationReasoning(drugs: any[]) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-lite", // Optimized for real-time slider feedback
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.1
      }
    });

    const prompt = `Analyze drug interaction: ${JSON.stringify(drugs)}. Focus on CNS/Renal/Cardio. 1-2 sentences with **bold markers**. JSON: {"reasoning": "..."}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text()).reasoning;
  } catch (error) {
    return "Analyzing organ impact...";
  }
}
