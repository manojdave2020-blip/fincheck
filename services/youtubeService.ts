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
   * Researches a YouTube channel and applies Smart Video Selection Filter.
   */
  async resolveChannel(input: string): Promise<ResolvedChannel> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Find the official YouTube channel for "${input}". 
      
      STEP 1: Identify official channel name, handle, and description.
      STEP 2: Retrieve up to 200 recent video titles from this channel.
      STEP 3: Apply the "Smart Video Selection Filter":
        - MUST be > 6 minutes (not a Short).
        - Title or description MUST contain at least one: ${VIDEO_SELECTION_KEYWORDS.join(', ')}.
        - MUST NOT contain any: ${EXCLUDED_KEYWORDS.join(', ')}.
      STEP 4: Select the top 10-20 most relevant/recent videos matching these criteria.
      
      Return as a JSON object with properties: name, handle, description, videos (array of {title, date, url}).`,
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
      description: data.description || "Financial analyst and market commentator.",
      recentVideos: (data.videos || []).map((v: any, i: number) => ({
        id: `v-${i}-${Date.now()}`,
        title: v.title || "Market Update",
        date: v.date || "Recent",
        url: v.url || "https://youtube.com"
      }))
    };
  }
}