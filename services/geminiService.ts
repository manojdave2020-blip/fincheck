
import { GoogleGenAI, Type } from "@google/genai";
import { Prediction, PredictionStatus, MarketDataPoint } from "../types";

export class GeminiService {
  /**
   * Uses Flash for claim extraction. It's faster and sufficient for text parsing.
   */
  async extractVideoClaims(videoTitle: string, videoUrl: string): Promise<{ 
    claims: Partial<Prediction>[], 
    isAnalysisHeavy: boolean 
  }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Switch to Flash for cost efficiency on simple text extraction
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Video: "${videoTitle}" (${videoUrl}). 
      Find specific, verifiable financial predictions (Price Targets, Buy/Sell calls).
      Only include claims with a clear asset, target price, and timeframe.`,
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
            required: ["rawQuote", "structuredClaim", "asset"]
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
   * Verifies a claim using Pro with Google Search grounding. 
   * This is the only place we use the high-tier model for accuracy.
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
      contents: `Verify this financial target using Google Search for real-time market data: "${claim}". 
      Check if the price was hit during the mentioned timeframe. Provide proof data.`,
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

    return JSON.parse(response.text || '{}');
  }
}
