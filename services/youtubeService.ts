
import { GoogleGenAI } from "@google/genai";
import { VIDEO_SELECTION_KEYWORDS, EXCLUDED_KEYWORDS } from "../constants";

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
      contents: `Find the YouTube channel for "${input}". 
      1. Get official name and handle.
      2. List 15-20 distinct videos from the PAST 12 MONTHS that contain financial predictions, stock analysis, or market forecasts.
      3. Avoid Shorts, Interviews, or Vlogs.
      
      Keywords to prioritize: ${VIDEO_SELECTION_KEYWORDS.join(', ')}.
      
      Return as JSON with fields: name, handle, description, videos (title, date, url).`,
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
      description: data.description || "Researching verified creator content...",
      recentVideos: (data.videos || []).map((v: any, i: number) => ({
        id: `v-${i}-${Date.now()}`,
        title: v.title,
        date: v.date,
        url: v.url
      }))
    };
  }
}
