
import { GoogleGenAI, Type } from "@google/genai";
import { Prediction, PredictionStatus, MarketDataPoint } from "../types";

export class GeminiService {
  /**
   * Uses Gemini to analyze video content via search/grounding to extract claims.
   */
  async extractVideoClaims(videoTitle: string, videoUrl: string): Promise<{ 
    claims: Partial<Prediction>[], 
    isAnalysisHeavy: boolean 
  }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for the transcript or key content of this YouTube video: "${videoTitle}" (${videoUrl}).
      Identify specific, verifiable financial predictions (e.g., "S&P 500 to 5000 by June").
      
      RULES:
      1. ONLY extract claims with a specific asset, target, and timeframe.
      2. Exclude vague advice.
      3. Return an empty array if no specific targets are found.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              rawQuote: { type: Type.STRING },
              timestamp: { type: Type.STRING },
              structuredClaim: { type: Type.STRING },
              asset: { type: Type.STRING }
            }
          }
        }
      }
    });

    const claims = JSON.parse(response.text || '[]');
    return {
      claims,
      isAnalysisHeavy: claims.length > 8
    };
  }

  /**
   * Verifies a single claim against real-time market data using Gemini 3 Pro.
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
      contents: `Verify this financial prediction against real-world historical and current market prices: "${claim}".
      1. Determine if the target was hit within the stated timeframe.
      2. Provide 3 specific price data points (date/price) that prove the outcome.
      3. Assign an accuracy score from 0.0 to 1.0.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ["Accurate", "Partially Accurate", "Inaccurate", "Pending Outcome"] },
            score: { type: Type.NUMBER },
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
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  }
}
