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

const withRetry = async <T>(fn: () => Promise<T>, maxRetries = 8): Promise<T> => {
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
        // More patient backoff for rate limits: 7s, 14s, 28s... 
        // We add more jitter to avoid "thundering herd" if multiple users retry at once
        const baseDelay = errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") ? 8000 : 5000;
        const waitTime = Math.pow(2, i) * baseDelay + Math.random() * 5000;
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
  Gib die Antwort als JSON-Array von Objekten mit den folgenden Schlüsseln zurück: name, description, rating, barberInstructions, suitabilityReason, recommendedProducts, faceShape.
  
  WICHTIG: Erkläre in 'suitabilityReason' ganz genau, warum dieser Style zur erkannten Gesichtsform passt (z.B. 'Dieses Volumen an den Seiten gleicht dein eher schmales Gesicht perfekt aus').`;

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

export const getAIPoweredStylingReason = async (
  faceShape: string,
  styleName: string,
  colorName: string,
  styleDescription: string
): Promise<string> => {
  try {
    const model = "gemini-3-flash-preview";
    const prompt = `Du bist ein professioneller Star-Friseur. Erkläre kurz und emotional (max. 2 Sätze), warum die Frisur "${styleName}" in der Farbe "${colorName}" perfekt zu einer ${faceShape}en Gesichtsform passt. 
    
    Kontext zum Style: ${styleDescription}
    
    Die Antwort muss auf Deutsch sein und den User begeistern. Erwähne spezifische Merkmale wie 'Wangenknochen betonen', 'Gesicht optisch strecken' oder 'weiche Konturen schaffen'.`;

    const response = await withRetry(() => getAI().models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        maxOutputTokens: 150,
      }
    }));

    return response.text || `Dieser Look schmeichelt deiner ${faceShape}en Gesichtsform und betont deine Züge auf elegante Weise.`;
  } catch (err) {
    console.error("Failed to get AI styling reason", err);
    return `Dieser Look ist eine exzellente Wahl für deine ${faceShape}e Gesichtsform und unterstreicht deine natürliche Ausstrahlung.`;
  }
};

export const generateBaseAvatarSketch = async (
  originalBase64: string, 
  mimeType: string
): Promise<string | null> => {
  const model = "gemini-2.5-flash-image";
  const prompt = `Create a high-end, minimalist charcoal fashion sketch of ONLY the person's face and head. 
  
  CRITICAL REQUIREMENTS:
  - CLOSE-UP PORTRAIT: Focus strictly on the face and head silhouette. No shoulders or body.
  - HAIRLESS/BALD BASE: Render the person with a clean bald head or very tight pulled back hair. This is a base for overlays.
  - STYLE: Elegant, professional ink lines on a clean white background. 
  - IDENTITY: Maintain the exact facial features and proportions to ensure recognition.
  - NO BACKGROUND: Plain white background only.`;

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

export const generateFashionSketch = async (
  originalBase64: string, 
  mimeType: string, 
  styleName: string,
  baseSketch?: string | null
): Promise<string | null> => {
  const model = "gemini-2.5-flash-image";
  const prompt = `Create a high-end, realistic fashion illustration of the person's head and neck with a ${styleName} hairstyle.
  
  STYLE REQUIREMENTS:
  - PORTRAIT HEADSHOT: Focus strictly on the head and neck. Do NOT show the full body or torso.
  - HIGH FIDELITY: Use professional fashion illustration techniques (pencil, charcoal, subtle watercolor).
  - ACCURACY: The person's facial features must look exactly like the original photo.
  - CONSISTENCY: If a base sketch is provided, use it as a reference for the artistic style, perspective, and facial proportions. 
  - HAIRSTYLE: The ${styleName} must look natural, textured, and elegant.
  - BACKGROUND: Clean, empty white background.`;

  const parts: any[] = [{ inlineData: { data: originalBase64, mimeType } }];
  
  if (baseSketch) {
    const sketchMimeType = baseSketch.split(';')[0].split(':')[1];
    const sketchData = baseSketch.split(',')[1];
    parts.push({ inlineData: { data: sketchData, mimeType: sketchMimeType } });
  }

  parts.push({ text: prompt });

  const response = await withRetry(() => getAI().models.generateContent({
    model,
    contents: { parts }
  }));

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  return null;
};

export const generateHairstyleImage = async (
  originalBase64: string, 
  mimeType: string, 
  styleName: string, 
  description: string
): Promise<string | null> => {
  const model = "gemini-2.5-flash-image";
  const prompt = `Render a photograph of the person in the image with the following hairstyle and professional salon coloring: ${styleName}. ${description}. 
  
  COLORING & TEXTURE REQUIREMENTS:
  - Use high-fidelity photorealistic textures for the hair.
  - The color must be natural and sophisticated, with realistic highlights, lowlights, and dimension as seen in high-end salon work.
  - Ensure the color precisely matches the requested shade provided in the description.
  
  CRITICAL IDENTITY PRESERVATION:
  1. Keep the person's face EXACTLY as it is. Do not alter facial features, skin tone, or underlying bone structure.
  2. ONLY modify the hair area.
  3. The identity and lighting of the original photo must be perfectly preserved.`;

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
