
import { GoogleGenAI } from "@google/genai";
import { VIDEO_SELECTION_KEYWORDS, EXCLUDED_KEYWORDS } from "../constants";

// Shim for process.env in browser environments
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: {} };
}

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
      throw new Error("API_KEY is not defined. Please check your Vercel Environment Variables.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Search YouTube for "${input}". 
      
      1. Confirm the channel name and @handle.
      2. Find up to 10 recent videos that are:
         - Over 6 minutes long.
         - Related to: ${VIDEO_SELECTION_KEYWORDS.join(', ')}.
         - NOT related to: ${EXCLUDED_KEYWORDS.join(', ')}.
      
      Return JSON: { "name": string, "handle": string, "description": string, "videos": [{ "title": string, "date": string, "url": string }] }`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(response.text || '{}');
    
    return {
      name: data.name || input,
      handle: data.handle || (input.startsWith('@') ? input : `@${input.replace(/\s/g, '')}`),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.name || input}&backgroundColor=F1F5F9`,
      description: data.description || "Verified Creator Profile.",
      recentVideos: (data.videos || []).map((v: any, i: number) => ({
        id: `v-${i}-${Date.now()}`,
        title: v.title,
        date: v.date,
        url: v.url
      }))
    };
  }
}
