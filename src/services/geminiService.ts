// src/services/geminiService.ts

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const callGeminiProxy = async (action: string, payload: any, maxRetries = 4): Promise<any> => {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      lastError = error;
      const errorMsg = (error.message || "").toLowerCase();
      
      // Retry logic for common network or server bottlenecks
      const isRetryable = 
        errorMsg.includes('429') || 
        errorMsg.includes('rate limit') || 
        errorMsg.includes('503') || 
        errorMsg.includes('overloaded') ||
        errorMsg.includes('504') ||
        errorMsg.includes('gateway timeout');

      if (isRetryable && i < maxRetries - 1) {
        const waitTime = Math.pow(2, i) * 2000 + Math.random() * 2000;
        console.warn(`AI proxy bottleneck hit (${errorMsg}), retrying in ${Math.round(waitTime)}ms... (Attempt ${i + 1}/${maxRetries})`);
        await sleep(waitTime);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

export interface HairColorTip {
  colorName: string;
  colorHex: string;
  whyItSuits: string;
}

export interface HairAnalysisResult {
  structureAndHealthSummary: string;
  careTips: string[];
  colorTips: HairColorTip[];
  disclaimer?: string;
}

export interface FaceAnalysisResponse {
  suggestions: HairstyleSuggestion[];
  hairAnalysis: HairAnalysisResult;
}

export const createDefaultHairAnalysis = (faceShape?: string): HairAnalysisResult => ({
  structureAndHealthSummary: "Auf dem analysierten Foto zeigt dein Haar eine schöne Grundfülle mit natürlichem Glanz und geschmeidigen Längen.",
  careTips: [
    "Nutze feuchtigkeitsspendende Pflege für seidige Geschmeidigkeit und natürliche Elastizität",
    "Verwende beim Föhnen sanfte Hitze sowie ein Hitzeschutz-Spray",
    "Verwöhne deine Haarspitzen einmal wöchentlich mit einer leicht pflegenden Intensivkur"
  ],
  colorTips: [
    {
      colorName: "Warmes Honigblond",
      colorHex: "#D4A359",
      whyItSuits: "Schmeichelt deinem Teint besonders sanft und lässt deine Augenpartie frischer und strahlender wirken."
    },
    {
      colorName: "Sanftes Schokobraun",
      colorHex: "#4A2E2B",
      whyItSuits: "Verleiht deiner Frisur eine zeitlose, edle Tiefe mit seidig glänzendem Finish."
    },
    {
      colorName: "Caramel / Sonniges Balayage",
      colorHex: "#C68B59",
      whyItSuits: "Setzt natürliche Lichtakzente, die deine Gesichtskonturen weich umspielen."
    }
  ],
  disclaimer: "Hinweis: Dies ist keine medizinische oder dermatologische Analyse, sondern eine visuelle Stil- & Pflegeberatung auf Basis deines Fotos."
});

export interface HairstyleSuggestion {
  id: string;
  name: string;
  description: string;
  rating: number;
  emotionalEnhancer?: string;
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

export interface StylingMetadata {
  description: string;
  suitabilityReason: string;
  barberInstructions: string;
  rating: number;
}

export const analyzeFaceAndSuggestStyles = async (
  base64Image: string, 
  mimeType: string
): Promise<FaceAnalysisResponse> => {
  try {
    const data = await callGeminiProxy("analyzeFace", { base64Image, mimeType });
    let text = data.text || "{}";
    text = text.replace(/```json\n?|```/g, "").trim();
    const parsed = JSON.parse(text);

    let rawSuggestions: any[] = [];
    let hairAnalysis: HairAnalysisResult | null = null;

    if (Array.isArray(parsed)) {
      rawSuggestions = parsed;
    } else if (parsed && typeof parsed === 'object') {
      if (Array.isArray(parsed.suggestions)) {
        rawSuggestions = parsed.suggestions;
      }
      if (parsed.hairAnalysis && typeof parsed.hairAnalysis === 'object') {
        hairAnalysis = {
          structureAndHealthSummary: parsed.hairAnalysis.structureAndHealthSummary || "",
          careTips: Array.isArray(parsed.hairAnalysis.careTips) ? parsed.hairAnalysis.careTips : [],
          colorTips: Array.isArray(parsed.hairAnalysis.colorTips) ? parsed.hairAnalysis.colorTips : [],
          disclaimer: parsed.hairAnalysis.disclaimer || "Hinweis: Dies ist keine medizinische oder dermatologische Analyse, sondern eine visuelle Stil- & Pflegeberatung auf Basis deines Fotos."
        };
      }
    }

    const suggestions = rawSuggestions.map((s: any, index: number) => ({
      ...s,
      id: `style-${Date.now()}-${index}`
    }));

    if (!hairAnalysis || !hairAnalysis.structureAndHealthSummary) {
      hairAnalysis = createDefaultHairAnalysis(suggestions[0]?.faceShape);
    }

    return {
      suggestions,
      hairAnalysis
    };
  } catch (e) {
    console.error("Failed to analyze face via proxy", e);
    throw e; // Bubble up for UI to handle (with sanitized message)
  }
};

export const getAIPoweredStylingMetadata = async (
  faceShape: string,
  styleName: string,
  colorName: string,
  styleDescription: string
): Promise<StylingMetadata> => {
  try {
    const data = await callGeminiProxy("getMetadata", { faceShape, styleName, colorName, styleDescription });
    let text = data.text || "{}";
    text = text.replace(/```json\n?|```/g, "").trim();
    const result = JSON.parse(text);
    
    return {
      description: result.description || styleDescription,
      suitabilityReason: result.suitabilityReason || `Dieser Look schmeichelt deiner ${faceShape}en Gesichtsform hervorragend.`,
      barberInstructions: result.barberInstructions || `Schnitt: ${styleName}. Farbe: ${colorName}. ${styleDescription}`,
      rating: result.rating || 95
    };
  } catch (err) {
    console.error("Failed to get AI metadata via proxy", err);
    return {
      description: styleDescription,
      suitabilityReason: `Dieser Look ist eine exzellente Wahl für deine ${faceShape}e Gesichtsform.`,
      barberInstructions: `Schnitt: ${styleName}. Nuance: ${colorName}. ${styleDescription}`,
      rating: 92
    };
  }
};

export const generateBaseAvatarSketch = async (
  originalBase64: string, 
  mimeType: string
): Promise<string | null> => {
  try {
    const data = await callGeminiProxy("generateImage", { 
      base64Image: originalBase64, 
      mimeType, 
      isSketch: true, 
      isBase: true 
    });
    
    if (data.imageData) return `data:image/png;base64,${data.imageData}`;
    return null;
  } catch (err) {
    console.error("Failed to generate base sketch via proxy", err);
    return null;
  }
};

export const generateFashionSketch = async (
  originalBase64: string, 
  mimeType: string, 
  styleName: string,
  baseSketch?: string | null
): Promise<string | null> => {
  try {
    const data = await callGeminiProxy("generateImage", { 
      base64Image: originalBase64, 
      mimeType, 
      styleName,
      isSketch: true, 
      baseSketch 
    });
    
    if (data.imageData) return `data:image/png;base64,${data.imageData}`;
    return null;
  } catch (err) {
    console.error("Failed to generate fashion sketch via proxy", err);
    return null;
  }
};

export const generateHairstyleImage = async (
  originalBase64: string, 
  mimeType: string, 
  styleName: string, 
  description: string
): Promise<string | null> => {
  try {
    const data = await callGeminiProxy("generateImage", { 
      base64Image: originalBase64, 
      mimeType, 
      styleName, 
      description,
      isSketch: false 
    });
    
    if (data.imageData) return `data:image/png;base64,${data.imageData}`;
    return null;
  } catch (err) {
    console.error("Failed to generate hairstyle image via proxy", err);
    throw err;
  }
};
