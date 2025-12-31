
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Find the official YouTube channel for the financial creator: "${input}". 
      
      Researching Phase:
      1. Use Google Search to verify the channel handle and official name.
      2. Identify the core niche (e.g., Value Investing, Macro Strategy, Crypto).
      3. Locate 15-20 distinct videos from the LAST 12 MONTHS where the creator makes SPECIFIC market predictions or gives targeted stock advice.
      4. Avoid non-financial content, life vlogs, or general news reactions.
      
      Keywords to prioritize: ${VIDEO_SELECTION_KEYWORDS.join(', ')}.
      
      Return as strictly valid JSON with the following structure:
      {
        "name": "Full Channel Name",
        "handle": "@handle",
        "description": "Short bio summary",
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
      console.error("Failed to parse channel JSON", e);
      throw new Error("Target entity resolution timed out or returned invalid data.");
    }

    // Handle missing or partial data
    if (!data.name || !data.videos) {
       throw new Error("Could not find a matching YouTube channel with verifiable financial content.");
    }

    return {
      name: data.name,
      handle: data.handle || `@${data.name.replace(/\s/g, '')}`,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.name}&backgroundColor=6366f1&textColor=ffffff`,
      description: data.description || "Active financial research entity.",
      recentVideos: data.videos.map((v: any, i: number) => ({
        id: `v-${i}-${Date.now()}`,
        title: v.title,
        date: v.date,
        url: v.url
      }))
    };
  }
}
