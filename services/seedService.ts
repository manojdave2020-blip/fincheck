
import { PredictionStatus } from "../types";

export const SEEDED_DATA = {
  "AkshatZayn": {
    creator: {
      name: "Akshat Shrivastava",
      handle: "@AkshatZayn",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Akshat&backgroundColor=b6e3f4",
      description: "Macro strategist focusing on long-term wealth cycles and market psychology.",
      niche: "Macro & Strategy",
      totalPredictions: 2,
      isAnalysisHeavy: false
    },
    claims: [
      {
        id: "seed-ak-1",
        videoTitle: "Is the Indian Market Overvalued? My 2024 Outlook",
        videoDate: "Jan 12, 2024",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamp: "04:22",
        rawQuote: "I expect Nifty to hit the 24,500 mark by the end of Q3 2024 as liquidity continues to flow.",
        structuredClaim: "Nifty 50 at 24,500 by Sept 2024",
        status: PredictionStatus.ACCURATE,
        score: 0.95,
        explanation: "Nifty 50 surpassed 24,500 in July 2024, ahead of the projected timeline.",
        marketData: [
          { date: "2024-07-15", price: "24,586", asset: "Nifty 50" },
          { date: "2024-01-12", price: "21,894", asset: "Nifty 50" }
        ]
      },
      {
        id: "seed-ak-2",
        videoTitle: "Real Estate Cycle: Why I'm Buying Now",
        videoDate: "Mar 05, 2024",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamp: "08:15",
        rawQuote: "Real estate stocks like DLF will see a 20% upside in the next 6 months.",
        structuredClaim: "DLF Stock +20% by Sept 2024",
        status: PredictionStatus.ACCURATE,
        score: 0.88,
        explanation: "DLF saw significant appreciation during this period, exceeding the 20% target.",
        marketData: [
          { date: "2024-03-05", price: "820", asset: "DLF" },
          { date: "2024-09-05", price: "1050", asset: "DLF" }
        ]
      }
    ]
  },
  "CARachanaRanade": {
    creator: {
      name: "CA Rachana Ranade",
      handle: "@CARachanaRanade",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Rachana&backgroundColor=ffdfbf",
      description: "Fundamental analysis expert simplifying complex financial concepts for retail investors.",
      niche: "Stock Analysis",
      totalPredictions: 1,
      isAnalysisHeavy: false
    },
    claims: [
      {
        id: "seed-rr-1",
        videoTitle: "HDFC Bank: Fundamental Disaster or Opportunity?",
        videoDate: "Feb 20, 2024",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamp: "12:40",
        rawQuote: "HDFC Bank at 1400 is a steal. I don't see it staying below 1600 for more than a quarter.",
        structuredClaim: "HDFC Bank to reach 1600 by May 2024",
        status: PredictionStatus.PARTIAL,
        score: 0.65,
        explanation: "The recovery took longer than a single quarter, but the price target was eventually approached.",
        marketData: [
          { date: "2024-02-20", price: "1420", asset: "HDFC Bank" },
          { date: "2024-06-15", price: "1595", asset: "HDFC Bank" }
        ]
      }
    ]
  },
  "udayanadhye": {
    creator: {
      name: "Udayan Adhye",
      handle: "@udayanadhye",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Udayan&backgroundColor=d1d4f9",
      description: "Institutional-grade equity research and value-based investment analysis.",
      niche: "Equity Research",
      totalPredictions: 1,
      isAnalysisHeavy: false
    },
    claims: [
      {
        id: "seed-ua-1",
        videoTitle: "Midcap Madness: Where is the Value?",
        videoDate: "Apr 10, 2024",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamp: "05:55",
        rawQuote: "The auto ancillary sector is ripe for a breakout. Look for a 15% move in major players by year end.",
        structuredClaim: "Auto Ancillary Index +15% by Dec 2024",
        status: PredictionStatus.PENDING,
        score: 0,
        explanation: "The timeframe is still active. Current trend is positive but target not yet fully realized.",
        marketData: [
          { date: "2024-04-10", price: "Base 100", asset: "Auto Ancillary Sector" },
          { date: "2024-08-30", price: "108", asset: "Auto Ancillary Sector" }
        ]
      }
    ]
  }
};

export const seedDatabase = () => {
  const existingAuditHistory = localStorage.getItem('audit_history');
  if (!existingAuditHistory) {
    const history: Record<string, any> = {};
    const recentSearches: any[] = [];
    const fullAuditStorage: Record<string, any> = {};

    Object.keys(SEEDED_DATA).forEach(key => {
      const data = (SEEDED_DATA as any)[key];
      const handle = data.creator.handle;
      
      // 1. Audit History for Homepage stats
      history[handle] = {
        count: data.claims.length,
        lastAudited: "Pre-loaded Audit",
        accuracy: "Verified"
      };

      // 2. Recent Searches for Leaderboard
      recentSearches.push({
        id: handle,
        name: data.creator.name,
        avatar: data.creator.avatar
      });

      // 3. Full Data for Profile Page
      fullAuditStorage[handle.replace('@', '')] = data;
    });

    localStorage.setItem('audit_history', JSON.stringify(history));
    localStorage.setItem('recent_searches', JSON.stringify(recentSearches));
    localStorage.setItem('seeded_audits', JSON.stringify(fullAuditStorage));
  }
};
