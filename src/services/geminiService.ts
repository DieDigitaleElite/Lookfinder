import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAI = () => {
  // Use a helper to get the key safely from multiple sources
  const getApiKey = () => {
    const win = window as any;
    
    // 1. Try direct Vite env access (most reliable in local/build)
    try {
      const env = (import.meta as any).env;
      if (env?.VITE_GEMINI_API_KEY) return env.VITE_GEMINI_API_KEY;
      if (env?.VITE_API_KEY) return env.VITE_API_KEY;
    } catch {}

    // 2. Try global variables (often used in production/cloud environments)
    if (win.GEMINI_API_KEY) return win.GEMINI_API_KEY;
    if (win.API_KEY) return win.API_KEY;
    
    // 3. Try process.env (fallback for some environments)
    try {
      if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
      if (process.env.API_KEY) return process.env.API_KEY;
    } catch {}

    return null;
  };
  
  const apiKey = getApiKey();
  
  if (!apiKey) {
    // This error message will be caught by App.tsx to show the selection UI
    throw new Error("API key is missing. Please provide a valid API key.");
  }
  
  return new GoogleGenAI({ apiKey });
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const withRetry = async <T>(fn: () => Promise<T>, maxRetries = 5): Promise<T> => {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const errorMsg = (error.message || "").toUpperCase();
      const status = error.status || error.code || 0;
      
      const isRetryable = errorMsg.includes("429") || 
                          errorMsg.includes("503") ||
                          errorMsg.includes("504") ||
                          errorMsg.includes("500") ||
                          errorMsg.includes("RESOURCE_EXHAUSTED") || 
                          errorMsg.includes("UNAVAILABLE") ||
                          errorMsg.includes("DEADLINE_EXCEEDED") ||
                          [429, 500, 503, 504].includes(status);

      if (isRetryable) {
        // More patient backoff: 5s, 10s, 20s...
        const waitTime = Math.pow(2, i) * 5000 + Math.random() * 2000;
        console.warn(`Transient error hit (Attempt ${i + 1}/${maxRetries}), retrying in ${Math.round(waitTime)}ms... Error: ${errorMsg}`);
        await sleep(waitTime);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

export interface HairstyleSuggestion {
  id: string;
  name: string;
  description: string;
  rating: number;
  barberInstructions: string;
  suitabilityReason: string;
  faceShape?: string;
  recommendedProducts: {
    name: string;
    type: string;
    reason: string;
  }[];
}

export interface GeneratedResult extends HairstyleSuggestion {
  imageUrl: string;
  failed?: boolean;
}

export const analyzeFaceAndSuggestStyles = async (base64Image: string, mimeType: string): Promise<HairstyleSuggestion[]> => {
  const model = "gemini-3-flash-preview";
  const prompt = `Analysiere die Gesichtsform und Merkmale dieser Person. Schlage 9 verschiedene Frisuren vor, die ihr gut stehen würden. 
  
  WICHTIG FÜR DIE AUSWAHL:
  - Die ersten 4 Vorschläge (Index 0 bis 3) MÜSSEN so unterschiedlich wie möglich sein (z.B. 1x kurz, 1x mittellang, 1x lang, 1x Trend-Style).
  - Wähle Styles, die wirklich zur Gesichtsform passen.
  - Alle 9 Vorschläge sollten insgesamt eine breite Palette abdecken.

  Gib für jede der 9 Frisuren folgendes an:
  1. Einen präzisen Namen (z.B. "Textured Crop mit Mid Fade").
  2. Eine kurze Beschreibung.
  3. Eine Bewertung von 1-10, wie gut der Style zur Person passt.
  4. Detaillierte Anweisungen für einen Friseur, um genau diesen Look zu erzielen.
  5. Einen Grund, warum dieser spezifische Style zur Gesichtsform passt.
  6. Eine Liste von 2-3 empfohlenen Styling-Produkten (Name, Typ, Grund der Empfehlung).
  7. Die erkannte Gesichtsform (z.B. "oval", "rund", "eckig", "herzförmig").

  Antworte ausschließlich in deutscher Sprache.
  Gib die Antwort als JSON-Array von Objekten mit den folgenden Schlüsseln zurück: name, description, rating, barberInstructions, suitabilityReason, recommendedProducts, faceShape.`;

  const response = await withRetry(() => getAI().models.generateContent({
    model,
    contents: [
      {
        parts: [
          { inlineData: { data: base64Image, mimeType } },
          { text: prompt }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
    }
  }));

  try {
    let text = response.text || "[]";
    // Remove markdown code blocks if present
    text = text.replace(/```json\n?|```/g, "").trim();
    const suggestions = JSON.parse(text);
    return suggestions.map((s: any, index: number) => ({
      ...s,
      id: `style-${Date.now()}-${index}`
    }));
  } catch (e) {
    console.error("Failed to parse suggestions", e);
    return [];
  }
};

export const generateHairstyleImage = async (
  originalBase64: string, 
  mimeType: string, 
  styleName: string, 
  description: string
): Promise<string | null> => {
  const model = "gemini-2.5-flash-image";
  const prompt = `Apply the following hairstyle to the person in the image: ${styleName}. ${description}. 
  
  CRITICAL: 
  1. Keep the person's face EXACTLY as it is. Do not change any facial features.
  2. ONLY modify the hair.
  3. The identity must be perfectly preserved.`;

  const response = await withRetry(() => getAI().models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { data: originalBase64, mimeType } },
        { text: prompt }
      ]
    }
  }));

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  return null;
};
