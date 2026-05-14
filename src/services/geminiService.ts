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

export interface StylingMetadata {
  description: string;
  suitabilityReason: string;
  barberInstructions: string;
  rating: number;
}

export const analyzeFaceAndSuggestStyles = async (base64Image: string, mimeType: string): Promise<HairstyleSuggestion[]> => {
  try {
    const data = await callGeminiProxy("analyzeFace", { base64Image, mimeType });
    let text = data.text || "[]";
    text = text.replace(/```json\n?|```/g, "").trim();
    const suggestions = JSON.parse(text);
    return suggestions.map((s: any, index: number) => ({
      ...s,
      id: `style-${Date.now()}-${index}`
    }));
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
    return null;
  }
};
