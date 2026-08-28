import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

export function getGemini(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Mock or fallback data will be used if needed.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isTransientError(error: any): boolean {
  if (!error) return false;
  const status = error.status || error.code || error.statusCode;
  const msg = (error.message || JSON.stringify(error) || "").toLowerCase();
  
  return (
    status === 503 ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 504 ||
    msg.includes("503") ||
    msg.includes("429") ||
    msg.includes("unavailable") ||
    msg.includes("high demand") ||
    msg.includes("resource_exhausted") ||
    msg.includes("rate limit") ||
    msg.includes("overloaded")
  );
}

export async function generateJSON<T>(
  prompt: string,
  systemInstruction?: string,
  schema?: any
): Promise<T> {
  const ai = getGemini();
  if (!ai) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }

  const candidateModels = ["gemini-3.7-flash", "gemini-flash-latest"];
  let lastError: any = null;

  for (const model of candidateModels) {
    const maxRetries = 2;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const config: any = {
          responseMimeType: "application/json",
        };

        if (systemInstruction) {
          config.systemInstruction = systemInstruction;
        }

        if (schema) {
          config.responseSchema = schema;
        }

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config,
        });

        const rawText = response.text || "{}";
        try {
          return JSON.parse(rawText) as T;
        } catch (parseErr) {
          // Attempt markdown JSON code block extraction
          const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (jsonMatch && jsonMatch[1]) {
            return JSON.parse(jsonMatch[1]) as T;
          }
          throw new Error(`Failed to parse JSON response from model: ${rawText.slice(0, 300)}`);
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Gemini API] Attempt ${attempt + 1}/${maxRetries} with model ${model} failed:`, err?.message || err);

        if (isTransientError(err) && attempt < maxRetries - 1) {
          // Jittered backoff: ~750ms - 1500ms
          const backoff = 750 + Math.random() * 750;
          console.log(`[Gemini API] Retrying ${model} in ${Math.round(backoff)}ms...`);
          await sleep(backoff);
          continue;
        }

        // If not a transient error or retries exhausted for this model, break to try fallback model if applicable
        if (!isTransientError(err)) {
          throw err;
        }
        break;
      }
    }
  }

  throw lastError || new Error("Failed to generate response after multiple model retries.");
}

