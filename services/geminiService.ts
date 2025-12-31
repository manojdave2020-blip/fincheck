
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
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API_KEY missing");

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Video Context: "${videoTitle}" (${videoUrl})
      Extract 1-3 specific, verifiable financial predictions.
      Claims must have: Asset, Target, and a clear Timeframe.`,
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
            },
            required: ["rawQuote", "structuredClaim", "asset", "timestamp"]
          }
        }
      }
    });

    let claims: Partial<Prediction>[] = [];
    try {
      const text = response.text || '[]';
      const jsonStr = text.includes('```json') ? text.split('```json')[1].split('```')[0] : text;
      claims = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Claims Parse Error", e);
    }

    return { claims, isAnalysisHeavy: claims.length > 3 };
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
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API_KEY missing");

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Verify this prediction: "${claim}". Research historical prices and determine accuracy.`,
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
          },
          required: ["status", "score", "explanation", "marketData"]
        }
      }
    });

    let result = {
      status: PredictionStatus.PENDING,
      score: 0,
      explanation: "Verification failed.",
      marketData: []
    };

    try {
      const text = response.text || '{}';
      const jsonStr = text.includes('```json') ? text.split('```json')[1].split('```')[0] : text;
      result = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Verification Parse Error", e);
    }

    return result;
  }
}
