
import { GoogleGenAI, Type } from "@google/genai";
import { VIDEO_SELECTION_KEYWORDS } from "../constants";

export interface ResolvedChannel {
  name: string;
  handle: string;
  avatar: string;
  description: string;
  recentVideos: Array<{ 
    id: string; 
    title: string; 
    date: string;
    url: string;
  }>;
}

export class YouTubeService {
  async resolveChannel(input: string): Promise<ResolvedChannel> {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is not configured. Please set the API_KEY environment variable.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a deep research probe to find the official YouTube channel for: "${input}". 
      
      Requirements:
      1. Use Google Search grounding to identify the verified channel handle and official name.
      2. Analyze the channel's niche to ensure it is a financial creator (Stocks, Crypto, Macro).
      3. Locate 15-20 distinct videos from the LAST 12 MONTHS where the creator makes SPECIFIC market predictions, targets, or forecasts.
      4. Do not include generic news or non-verifiable content.
      
      Keywords: ${VIDEO_SELECTION_KEYWORDS.join(', ')}.
      
      Output Schema:
      {
        "name": "Full Creator Name",
        "handle": "@handle",
        "description": "Short metadata bio",
        "videos": [{"title": "Video Title", "date": "Month Year", "url": "https://youtube.com/..."}]
      }`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            handle: { type: Type.STRING },
            description: { type: Type.STRING },
            videos: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  date: { type: Type.STRING },
                  url: { type: Type.STRING }
                },
                required: ["title", "date", "url"]
              }
            }
          },
          required: ["name", "handle", "description", "videos"]
        }
      },
    });

    let data: any = {};
    try {
      const text = response.text || '{}';
      const jsonStr = text.includes('```json') ? text.split('```json')[1].split('```')[0] : text;
      data = JSON.parse(jsonStr);
    } catch (e) {
      console.error("JSON Resolution Error", e);
      throw new Error("The Audit Engine could not parse the channel's metadata correctly.");
    }

    if (!data.name || !data.videos || data.videos.length === 0) {
       throw new Error("No verifiable financial content found for this entity.");
    }

    return {
      name: data.name,
      handle: data.handle || `@${data.name.replace(/\s/g, '')}`,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.name}&backgroundColor=6366f1&textColor=ffffff`,
      description: data.description || "Active Financial Analyst",
      recentVideos: data.videos.map((v: any, i: number) => ({
        id: `v-${i}-${Date.now()}`,
        title: v.title,
        date: v.date,
        url: v.url
      }))
    };
  }
}
