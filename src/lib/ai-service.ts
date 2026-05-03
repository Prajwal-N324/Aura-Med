import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

// Updated to the next-gen models identified in your diagnostic
const MODELS = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.0-flash-lite", "gemini-pro-latest"];

export async function analyzeSymptoms(symptoms: string, location: string = "India") {
  let lastError = null;

  for (const modelName of MODELS) {
    try {
      console.log(`Neural Link: Attempting connection to ${modelName}...`);
      
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
        }
      });

      const prompt = `
        As a Senior Medical Consultant in India, perform a clinical analysis of these symptoms: "${symptoms}".
        The patient's current location is: "${location}".
        
        Return ONLY a JSON object:
        {
          "diseases": [{"name": "Condition Name", "probability": "High"}],
          "hospitals": [{"name": "Real Hospital Name (e.g. Apollo, Manipal, AIIMS)", "location": "Area in ${location}", "type": "Specialty"}],
          "treatment_options": [{"category": "Govt/Private Tier", "estimated_cost": "₹X,XXX - ₹XX,XXX", "description": "Clinical summary in Indian context"}],
          "gemini_thoughts": [
            {"point": "Observation Title", "detail": "Detailed explanation with **bold highlights**."}
          ],
          "model_interpretation": "Definitive clinical recommendation with **Actionable Solution**.",
          "advice": "Mandatory medical disclaimer."
        }
        Provide at least 5 distinct gemini_thoughts. Use Markdown bolding (**) for important medical terms.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const parsedData = JSON.parse(text);
      console.log(`Aura Med Intelligence [${modelName}]:`, parsedData);
      return parsedData;

    } catch (error: any) {
      console.warn(`${modelName} Link Failure:`, error.message);
      lastError = error;
      continue;
    }
  }

  return { 
    error: "Universal Intelligence Sync Failure. Please check API quota.",
    diseases: [],
    hospitals: [],
    treatment_options: [],
    gemini_thought_process: "Critical failure in neural reasoning layer.",
    model_interpretation: "Emergency backup required.",
    advice: "Consult a human physician immediately."
  };
}
