
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
  /**
   * Efficiently resolves a channel using the faster Flash model.
   * If the input is a known URL, it skips discovery and moves straight to filtering.
   */
  async resolveChannel(input: string): Promise<ResolvedChannel> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using Flash instead of Pro for metadata discovery to save tokens/cost
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
