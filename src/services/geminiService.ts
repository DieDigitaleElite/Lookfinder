import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAI = () => {
  // Use a helper to get the key safely from multiple sources
  const getApiKey = () => {
    const win = window as any;
    
    // Priority list of sources for the API key
    const sources = [
      () => (import.meta as any).env?.VITE_GEMINI_API_KEY,
      () => (import.meta as any).env?.VITE_API_KEY,
      () => process.env.GEMINI_API_KEY,
      () => process.env.API_KEY,
      () => win.API_KEY,
      () => win.GEMINI_API_KEY,
      () => win.process?.env?.API_KEY,
      () => win.process?.env?.GEMINI_API_KEY,
      () => win.config?.API_KEY,
      () => win._env_?.API_KEY
    ];

    for (const source of sources) {
      try {
        const key = source();
        if (key && typeof key === 'string' && key.length > 10 && 
            !["MY_GEMINI_API_KEY", "sk_test_...", "TODO"].includes(key)) {
          return key;
        }
      } catch {}
    }
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
      const errorMsg = error.message || "";
      const isRetryable = errorMsg.includes("429") || 
                          errorMsg.includes("503") ||
                          errorMsg.includes("504") ||
                          errorMsg.includes("500") ||
                          errorMsg.includes("RESOURCE_EXHAUSTED") || 
                          errorMsg.includes("UNAVAILABLE") ||
                          errorMsg.includes("DEADLINE_EXCEEDED") ||
                          errorMsg.includes("INTERNAL") ||
                          [429, 500, 503, 504].includes(error.status) ||
                          [429, 500, 503, 504].includes(error.code);

      if (isRetryable) {
        // Exponential backoff: 3s, 6s, 12s, 24s, 48s...
        const waitTime = Math.pow(2, i) * 3000 + Math.random() * 1000;
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
  const prompt = `Analysiere die Gesichtsform und Merkmale dieser Person. Schlage EXAKT 9 verschiedene Frisuren vor, die ihr gut stehen würden.
  WICHTIG: Du MUSST genau 9 Objekte im Array zurückgeben. Die Auswahl MUSS genau diese Verteilung haben:
  - 3 kurze Frisuren
  - 3 mittellange Frisuren
  - 3 lange Frisuren

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
  
  CRITICAL REQUIREMENT - ABSOLUTE FACE PRESERVATION: 
  1. The person's face, facial features, skin tone, eye color, and bone structure MUST remain 100% ORIGINAL and UNCHANGED. 
  2. The final image MUST be recognizable as the EXACT same person from the original photo.
  3. ONLY the hair should be modified to match the requested style. 
  4. Do NOT alter the eyes, nose, mouth, eyebrows, chin, or any other facial characteristics. 
  5. The identity of the person must be perfectly preserved. It should look like a real photo of the SAME person.
  6. Do not beautify, slim, or change the facial expression. Keep the original face exactly as it is.
  7. The result should look like a realistic professional photograph of the original person with a new haircut.`;

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
