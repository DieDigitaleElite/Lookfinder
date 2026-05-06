import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Helper to call our secure backend proxy
const callGeminiProxy = async (params: { model: string; contents: any; config?: any }) => {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || `Server error: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const withRetry = async <T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> => {
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

      if (isRetryable && i < maxRetries - 1) {
        const baseDelay = errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") ? 5000 : 2000;
        const waitTime = Math.pow(2, i) * baseDelay + Math.random() * 2000;
        console.warn(`Transient error hit (Attempt ${i + 1}/${maxRetries}), retrying in ${Math.round(waitTime)}ms...`);
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
  imageUrl: string | null;
  sourceImageUrl?: string;
  failed?: boolean;
}

export const analyzeFaceAndSuggestStyles = async (base64Image: string, mimeType: string): Promise<HairstyleSuggestion[]> => {
  const model = "gemini-3-flash-preview";
  const prompt = `Analysiere die Gesichtsform und Merkmale dieser Person. Schlage 9 verschiedene Frisuren vor, die ihr hervorragend stehen würden.

  WICHTIG FÜR DIE AUSWAHL (ERSTEN 3 VORSCHLÄGE):
  - Der ABSOLUT wichtigste Fokus liegt auf der ERHALTUNG DER IDENTITÄT. Das Gesicht (Augen, Nase, Kinn, Wangenknochen, Kopfdrehung) muss später bei der Bildgenerierung völlig unverändert bleiben.
  - Berücksichtige bei den ersten 3 Vorschlägen die ORIGINAL-Haarfarbe und Struktur des Users, um ein realistisches und harmonisches Ergebnis zu erzielen.
  - Die Reihenfolge der ersten 3 Styles MUSS exakt so sein:
    1. Ein MITTELLANGER Style (Index 0)
    2. Ein LANGER Style (Index 1)
    3. Ein KURZER Style (Index 2)
  - Ab Index 3 können die Styles variieren (Trends, mutige Änderungen etc.).

  TONALITÄT & FORMULIERUNG:
  - Formuliere die Texte bei 'suitabilityReason' (Warum dieser Style?) besonders nett, wertschätzend und positiv.
  - Vermeide rein technische oder potenziell demotivierende Aussagen wie "Dein Gesicht ist zu lang" oder "Deine Stirn ist breit".
  - Nutze stattdessen begeisternde Formulierungen wie: "Dieser Look betont deine eleganten Gesichtszüge perfekt" oder "Das Volumen schmeichelt deiner markanten Kinnlinie und verleiht deinem Look eine sanfte Note".
  - Erschaffe einen "Wohlfühl-Vibe" – der User soll sich nach dem Lesen attraktiv fühlen.

  Gib für jede der 9 Frisuren folgendes an:
  1. Einen präzisen Namen (z.B. "Textured Crop mit Mid Fade").
  2. Eine kurze Beschreibung.
  3. Eine Bewertung von 1-10, wie gut der Style zur Person passt.
  4. Detaillierte Anweisungen für einen Friseur, um genau diesen Look zu erzielen.
  5. Einen positiven Grund ('suitabilityReason'), warum dieser spezifische Style die natürlichen Vorzüge betont.
  6. Eine Liste von 2-3 empfohlenen Styling-Produkten (Name, Typ, Grund der Empfehlung).
  7. Die erkannte Gesichtsform (z.B. "oval", "rund", "eckig", "herzförmig").

  Antworte ausschließlich in deutscher Sprache.
  Gib die Antwort als JSON-Array von Objekten mit den folgenden Schlüsseln zurück: name, description, rating, barberInstructions, suitabilityReason, recommendedProducts, faceShape.`;

  const response = await withRetry(() => callGeminiProxy({
    model,
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType } },
        { text: prompt }
      ]
    },
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

export interface StylingMetadata {
  description: string;
  suitabilityReason: string;
  barberInstructions: string;
  rating: number;
}

export const getAIPoweredStylingMetadata = async (
  faceShape: string,
  styleName: string,
  colorName: string,
  styleDescription: string
): Promise<StylingMetadata> => {
  try {
    const model = "gemini-3-flash-preview";
    const prompt = `Du bist ein professioneller Star-Friseur und Image-Berater. 
    Analysiere die Kombination aus der Frisur "${styleName}" in der Farbe "${colorName}" für eine Person mit einer ${faceShape}en Gesichtsform.
    
    Kontext zum gewählten Style: ${styleDescription}
    
    Erstelle drei hochwertige Texte auf Deutsch:
    1. Eine detaillierte BESCHREIBUNG des Looks (2-3 Sätze).
    2. Einen positiven GRUND ('suitabilityReason'), warum dieser Style die natürlichen Vorzüge des Users (Wangenknochen, Augen, Konturen) bei dieser Gesichtsform perfekt unterstreicht. Sei begeisternd und wertschätzend (2-3 Sätze).
    3. Detaillierte ANWEISUNGEN für einen Friseur (barberInstructions), um exakt diesen Schnitt und diese Farbe meisterhaft umzusetzen.
    4. Eine BEWERTUNG von 1-10 (rating), wie gut dieser Look zur Person passt.
    
    Antworte ausschließlich im JSON-Format mit den Schlüsseln: description, suitabilityReason, barberInstructions, rating.`;

    const response = await withRetry(() => callGeminiProxy({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    }));

    let text = response.text || "{}";
    text = text.replace(/```json\n?|```/g, "").trim();
    const data = JSON.parse(text);
    
    return {
      description: data.description || styleDescription,
      suitabilityReason: data.suitabilityReason || `Dieser Look schmeichelt deiner ${faceShape}en Gesichtsform hervorragend.`,
      barberInstructions: data.barberInstructions || `Schnitt: ${styleName}. Farbe: ${colorName}. ${styleDescription}`,
      rating: data.rating || 9.5
    };
  } catch (err) {
    console.error("Failed to get AI styling metadata", err);
    return {
      description: styleDescription,
      suitabilityReason: `Dieser Look ist eine exzellente Wahl für deine ${faceShape}e Gesichtsform und unterstreicht deine natürliche Ausstrahlung.`,
      barberInstructions: `Schnitt: ${styleName}. Nuance: ${colorName}. ${styleDescription}`,
      rating: 9.2
    };
  }
};

export const generateBaseAvatarSketch = async (
  originalBase64: string, 
  mimeType: string
): Promise<string | null> => {
  const model = "gemini-2.5-flash-image";
  const prompt = `Create a high-end, minimalist charcoal fashion sketch of the person's face and head.

  CRITICAL IDENTITY REQUIREMENT:
  - You MUST preserve the exact facial features, eye shape, nose structure, and mouth of the person in the photo. The person must be 100% recognizable.
  - Render the person with a clean bald head (hairless base) while keeping the face perfectly intact. This will be used as a template for hairstyles.
  - Use elegant, professional ink/charcoal lines on a clean white background. 
  - Close-up portrait only (head and neck).
  - NO background details.`;

  const response = await withRetry(() => callGeminiProxy({
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
  const prompt = `Create a high-end fashion illustration of the person with the hairstyle: ${styleName}.
  
  ABSOLUTE IDENTITY PERSERVATION:
  - The facial features (eyes, nose, mouth, chin, skin texture) must be an EXACT 1:1 artistic copy of the person in the provided photo. Do not beautify or alter them.
  - Seamlessly add the ${styleName} hairstyle to their existing head.
  - Maintain the head position and perspective perfectly.
  - Use professional fashion illustration techniques (pencil, charcoal, subtle wash).
  - Clean white background. Do not show body or clothes.`;

  const parts: any[] = [{ inlineData: { data: originalBase64, mimeType } }];
  
  if (baseSketch) {
    const sketchMimeType = baseSketch.split(';')[0].split(':')[1];
    const sketchData = baseSketch.split(',')[1];
    parts.push({ inlineData: { data: sketchData, mimeType: sketchMimeType } });
  }

  parts.push({ text: prompt });

  const response = await withRetry(() => callGeminiProxy({
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
  const prompt = `Perform a pixel-perfect hairstyle swap. Render a photograph of the person in the image wearing this hairstyle: ${styleName}. ${description}. 
  
  STRICT MANDATORY RULES (ZERO TOLERANCE FOR DEVIATION):
  1. ABSOLUTE FACE PRESERVATION: The person's identity MUST remain 100% identical. Every pixel of the eyes, eyelids, nose (bridge, tip, nostrils), mouth (lip shape), chin, jawline, teeth, skin texture, wrinkles, moles, and eyebrows MUST look exactly as they do in the original photo. The head rotation and facial expression must be maintained perfectly.
  2. HAIR SWAP ONLY: Only modify the hair area. The new hairstyle must originate from the natural hairline and blend seamlessly with the temples and ears of the ORIGINAL person.
  3. PHOTOREALISM: The hair must look real, not like a wig. Use natural lighting that matches the original photo's environment.
  4. CONSISTENCY: Ensure that the forehead and face are not covered more than the chosen style strictly requires.`;

  const response = await withRetry(() => callGeminiProxy({
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
