
import { GoogleGenAI, Type } from "@google/genai";
import { Prediction, PredictionStatus, MarketDataPoint } from "../types";

export class GeminiService {
  /**
   * Uses Gemini to extract specific verifiable financial claims from a video's context.
   */
  async extractVideoClaims(videoTitle: string, videoUrl: string): Promise<{ 
    claims: Partial<Prediction>[], 
    isAnalysisHeavy: boolean 
  }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Video Title: "${videoTitle}"
      Video Source: ${videoUrl}

      Analyze the likely content based on this video metadata.
      Find specific, verifiable financial predictions (e.g., "Nifty to hit 25k by December", "Buy Reliance at 2800").
      Only include claims that specify:
      1. An asset name
      2. A target price or percentage move
      3. A specific timeframe or deadline
      
      Return a JSON array of claims. Include a 'timestamp' in MM:SS format where the claim likely occurs.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              rawQuote: { type: Type.STRING, description: "The verbatim or paraphrased prediction." },
              timestamp: { type: Type.STRING, description: "MM:SS format." },
              structuredClaim: { type: Type.STRING, description: "Short summary: Asset @ Price by Date." },
              asset: { type: Type.STRING }
            },
            required: ["rawQuote", "structuredClaim", "asset", "timestamp"]
          }
        }
      }
    });

    const claims = JSON.parse(response.text || '[]');
    return {
      claims,
      isAnalysisHeavy: claims.length > 5
    };
  }

  /**
   * Verifies a specific claim using Google Search grounding.
   */
  async verifyClaim(claim: string): Promise<{
    status: PredictionStatus;
    score: number;
    explanation: string;
    marketData: MarketDataPoint[];
  }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Perform a factual audit on this financial prediction: "${claim}". 
      Use Google Search to find historical price data for the asset during the predicted timeframe.
      Determine if the target was met.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ["Accurate", "Partially Accurate", "Inaccurate", "Pending Outcome"] },
            score: { type: Type.NUMBER, description: "Confidence/Accuracy score from 0.0 to 1.0" },
            explanation: { type: Type.STRING },
            marketData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  price: { type: Type.STRING },
                  asset: { type: Type.STRING }
                }
              }
            }
          },
          required: ["status", "score", "explanation", "marketData"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    // Extract URLs from grounding if available to satisfy requirements
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    if (sources.length > 0) {
      const sourceLinks = sources
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => `Source: ${chunk.web.title} (${chunk.web.uri})`)
        .join('\n');
      result.explanation += `\n\nVerified via:\n${sourceLinks}`;
    }

    return result;
  }
}
