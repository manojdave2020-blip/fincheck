
import { PredictionStatus } from "../types";

export const SEEDED_DATA = {
  "AkshatZayn": {
    creator: {
      name: "Akshat Shrivastava",
      handle: "@AkshatZayn",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Akshat&backgroundColor=b6e3f4",
      description: "Macro strategist focusing on long-term wealth cycles, market psychology, and asset allocation.",
      niche: "Macro & Strategy",
      totalPredictions: 8,
      isAnalysisHeavy: true
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
        score: 0.98,
        explanation: "Nifty 50 reached the 24,500 level in mid-July 2024, significantly ahead of the end-of-Q3 projection.",
        marketData: [
          { date: "2024-01-12", price: "21,894", asset: "Nifty 50" },
          { date: "2024-07-19", price: "24,530", asset: "Nifty 50" }
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
        score: 0.92,
        explanation: "DLF stock price moved from ~820 in March to over 1050 by June, fulfilling the 20% upside target within 3 months.",
        marketData: [
          { date: "2024-03-05", price: "820", asset: "DLF" },
          { date: "2024-06-12", price: "1065", asset: "DLF" }
        ]
      },
      {
        id: "seed-ak-3",
        videoTitle: "Why I am Selling My Midcap Mutual Funds",
        videoDate: "Feb 15, 2024",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamp: "10:30",
        rawQuote: "Midcaps are looking frothy. Expect a 10-15% correction in the midcap index before May.",
        structuredClaim: "Nifty Midcap 100 correction of 10% by May 2024",
        status: PredictionStatus.ACCURATE,
        score: 0.85,
        explanation: "The Midcap index saw a sharp correction of approximately 10.5% during the March 2024 volatility spike.",
        marketData: [
          { date: "2024-02-15", price: "49,200", asset: "Nifty Midcap 100" },
          { date: "2024-03-20", price: "44,100", asset: "Nifty Midcap 100" }
        ]
      },
      {
        id: "seed-ak-4",
        videoTitle: "Gold vs Equity: The Final Choice",
        videoDate: "Dec 20, 2023",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamp: "15:45",
        rawQuote: "Gold is the dark horse. It will cross 72,000 per 10g in India by Diwali 2024.",
        structuredClaim: "MCX Gold at 72,000 by Nov 2024",
        status: PredictionStatus.ACCURATE,
        score: 0.95,
        explanation: "Gold prices surged globally and hit 72,000 in India as early as April 2024, far exceeding expectations.",
        marketData: [
          { date: "2023-12-20", price: "62,500", asset: "Gold (10g)" },
          { date: "2024-04-12", price: "72,800", asset: "Gold (10g)" }
        ]
      },
      {
        id: "seed-ak-5",
        videoTitle: "HDFC Bank: The Giant is Sleeping",
        videoDate: "Jan 25, 2024",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamp: "05:10",
        rawQuote: "HDFC Bank under 1450 is a massive opportunity. It will rebound to 1700 within 2 quarters.",
        structuredClaim: "HDFC Bank at 1700 by July 2024",
        status: PredictionStatus.PARTIAL,
        score: 0.70,
        explanation: "HDFC Bank hit 1700+ in early July, but spent much more time in the 1400-1500 range than initially projected.",
        marketData: [
          { date: "2024-01-25", price: "1430", asset: "HDFC Bank" },
          { date: "2024-07-03", price: "1720", asset: "HDFC Bank" }
        ]
      },
      {
        id: "seed-ak-6",
        videoTitle: "The Case for PSU Stocks",
        videoDate: "Nov 10, 2023",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamp: "02:50",
        rawQuote: "Railway stocks like IRFC have more gas. I see IRFC reaching 150 levels comfortably.",
        structuredClaim: "IRFC at 150 by mid-2024",
        status: PredictionStatus.ACCURATE,
        score: 0.99,
        explanation: "IRFC breached 150 in January 2024 and even touched 200 later, making the call extremely accurate.",
        marketData: [
          { date: "2023-11-10", price: "75", asset: "IRFC" },
          { date: "2024-01-20", price: "160", asset: "IRFC" }
        ]
      },
      {
        id: "seed-ak-7",
        videoTitle: "US Recession Fears & Indian Markets",
        videoDate: "May 15, 2024",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamp: "12:15",
        rawQuote: "Nasdaq will hit an all-time high despite high rates. Watch for 18,500+.",
        structuredClaim: "Nasdaq 100 at 18,500 by end of 2024",
        status: PredictionStatus.ACCURATE,
        score: 0.90,
        explanation: "Nasdaq 100 hit 18,500 in June 2024, much earlier than the 'end of year' projection.",
        marketData: [
          { date: "2024-05-15", price: "17,600", asset: "Nasdaq 100" },
          { date: "2024-06-18", price: "18,600", asset: "Nasdaq 100" }
        ]
      },
      {
        id: "seed-ak-8",
        videoTitle: "Zomato: From Loss to Profit",
        videoDate: "Feb 08, 2024",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamp: "07:40",
        rawQuote: "Zomato at 140 is still cheap. It will double to 280 in the next 12-18 months.",
        structuredClaim: "Zomato at 280 by mid-2025",
        status: PredictionStatus.PENDING,
        score: 0,
        explanation: "The stock has reached 260 as of August 2024. The target is likely to be hit well before the deadline.",
        marketData: [
          { date: "2024-02-08", price: "144", asset: "Zomato" },
          { date: "2024-08-20", price: "262", asset: "Zomato" }
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
      totalPredictions: 5,
      isAnalysisHeavy: true
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
        explanation: "The recovery took slightly longer than projected (hit 1600 in June), but the directional call was sound.",
        marketData: [
          { date: "2024-02-20", price: "1420", asset: "HDFC Bank" },
          { date: "2024-06-15", price: "1595", asset: "HDFC Bank" }
        ]
      },
      {
        id: "seed-rr-2",
        videoTitle: "Reliance Industries: The Future of Jio Financial Services",
        videoDate: "Mar 15, 2024",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamp: "08:10",
        rawQuote: "Reliance is consolidating. Expect a breakout towards 3000 levels once the telecom tariff hike news is formalised.",
        structuredClaim: "Reliance at 3000 by Q3 2024",
        status: PredictionStatus.ACCURATE,
        score: 0.94,
        explanation: "Reliance hit the 3000+ level in late June 2024 following telecom tariff hike announcements.",
        marketData: [
          { date: "2024-03-15", price: "2850", asset: "Reliance" },
          { date: "2024-07-01", price: "3130", asset: "Reliance" }
        ]
      },
      {
        id: "seed-rr-3",
        videoTitle: "IT Sector: Is the Worst Over for TCS & Infosys?",
        videoDate: "Apr 22, 2024",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamp: "15:30",
        rawQuote: "IT stocks are in value zone. Infosys should recover to 1600 as deal wins stabilize.",
        structuredClaim: "Infosys at 1600 by August 2024",
        status: PredictionStatus.ACCURATE,
        score: 0.90,
        explanation: "Infosys recovered strongly and surpassed 1600 in July 2024, meeting the target ahead of time.",
        marketData: [
          { date: "2024-04-22", price: "1420", asset: "Infosys" },
          { date: "2024-07-25", price: "1780", asset: "Infosys" }
        ]
      },
      {
        id: "seed-rr-4",
        videoTitle: "Stock Market Crash Warning? P/E Analysis",
        videoDate: "Dec 05, 2023",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamp: "05:45",
        rawQuote: "Nifty P/E is stretching. Don't be surprised if we see a 5% healthly pullback in January.",
        structuredClaim: "Nifty 50 pullback of 5% in Jan 2024",
        status: PredictionStatus.INACCURATE,
        score: 0.20,
        explanation: "Nifty remained resilient and trended sideways-to-positive in January, avoiding a 5% pullback.",
        marketData: [
          { date: "2023-12-05", price: "20,850", asset: "Nifty 50" },
          { date: "2024-01-31", price: "21,720", asset: "Nifty 50" }
        ]
      },
      {
        id: "seed-rr-5",
        videoTitle: "Banking Sector Outlook: PSU vs Private",
        videoDate: "May 10, 2024",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamp: "10:20",
        rawQuote: "SBI is fundamentally the strongest PSU bank. It's on its way to hit 900 levels.",
        structuredClaim: "SBI at 900 by end of 2024",
        status: PredictionStatus.PENDING,
        score: 0,
        explanation: "SBI has hit a high of 860 recently. The 900 target remains active for the year-end timeframe.",
        marketData: [
          { date: "2024-05-10", price: "810", asset: "SBI" },
          { date: "2024-08-20", price: "845", asset: "SBI" }
        ]
      }
    ]
  },
  "udayanadhye": {
    creator: {
      name: "Udayan Adhye",
      handle: "@udayanadhye",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Udayan&backgroundColor=d1d4f9",
      description: "Institutional-grade equity research and value-based investment analysis focusing on high-growth sectors.",
      niche: "Equity Research",
      totalPredictions: 5,
      isAnalysisHeavy: true
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
        status: PredictionStatus.ACCURATE,
        score: 0.88,
        explanation: "Sector breakout occurred in June-July. Several key stocks in the ancillary space moved up by 15-20%.",
        marketData: [
          { date: "2024-04-10", price: "Base 100", asset: "Auto Ancillary Sector" },
          { date: "2024-07-30", price: "118", asset: "Auto Ancillary Sector" }
        ]
      },
      {
        id: "seed-ua-2",
        videoTitle: "Chemical Stocks: Bottoming Out?",
        videoDate: "Mar 20, 2024",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamp: "12:45",
        rawQuote: "Specialty chemicals are undervalued. PI Industries is a solid buy for a 10% gain in 2 months.",
        structuredClaim: "PI Industries +10% by May 2024",
        status: PredictionStatus.ACCURATE,
        score: 0.95,
        explanation: "PI Industries rallied strongly from 3400 to 3900 within the specified two-month window.",
        marketData: [
          { date: "2024-03-20", price: "3450", asset: "PI Industries" },
          { date: "2024-05-20", price: "3890", asset: "PI Industries" }
        ]
      },
      {
        id: "seed-ua-3",
        videoTitle: "Defense Sector: Is the Rally Sustainable?",
        videoDate: "Jan 15, 2024",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamp: "04:30",
        rawQuote: "HAL is the leader here. I see it touching 4000 (pre-split equivalent) very soon.",
        structuredClaim: "HAL at 4000 by mid-2024",
        status: PredictionStatus.ACCURATE,
        score: 0.99,
        explanation: "HAL prices skyrocketed in early 2024, surpassing the 4000-equivalent mark by April.",
        marketData: [
          { date: "2024-01-15", price: "3050", asset: "HAL" },
          { date: "2024-04-30", price: "4200", asset: "HAL" }
        ]
      },
      {
        id: "seed-ua-4",
        videoTitle: "Smallcap Investing: My Top 3 Picks",
        videoDate: "Feb 28, 2024",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamp: "09:15",
        rawQuote: "I'm looking at infra smallcaps. Expect a 20% move in specialized EPC players before the monsoon.",
        structuredClaim: "Infra Smallcaps +20% by June 2024",
        status: PredictionStatus.PARTIAL,
        score: 0.60,
        explanation: "While the sector moved, only specific stocks hit the 20% mark, others were flat due to election volatility.",
        marketData: [
          { date: "2024-02-28", price: "Base 100", asset: "Infra Smallcap Proxy" },
          { date: "2024-06-10", price: "112", asset: "Infra Smallcap Proxy" }
        ]
      },
      {
        id: "seed-ua-5",
        videoTitle: "The Pharma Pivot: Why Value is Emerging",
        videoDate: "May 25, 2024",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamp: "07:50",
        rawQuote: "Sun Pharma is ready for a new high. Target 1600 as export margins improve.",
        structuredClaim: "Sun Pharma at 1600 by end of 2024",
        status: PredictionStatus.ACCURATE,
        score: 0.92,
        explanation: "Sun Pharma hit 1600 in July 2024, confirming the value emergence thesis earlier than expected.",
        marketData: [
          { date: "2024-05-25", price: "1480", asset: "Sun Pharma" },
          { date: "2024-07-20", price: "1625", asset: "Sun Pharma" }
        ]
      }
    ]
  }
};

export const seedDatabase = () => {
  // Always regenerate the current timestamp for "auto-refresh"
  const today = new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  const history: Record<string, any> = {};
  const recentSearches: any[] = [];
  const fullAuditStorage: Record<string, any> = {};

  Object.keys(SEEDED_DATA).forEach(key => {
    const data = (SEEDED_DATA as any)[key];
    const handle = data.creator.handle;
    
    // 1. Audit History for Homepage stats
    history[handle] = {
      count: data.claims.length,
      lastAudited: today,
      status: "Completed",
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

  // Persist to local storage
  localStorage.setItem('audit_history', JSON.stringify(history));
  localStorage.setItem('recent_searches', JSON.stringify(recentSearches));
  localStorage.setItem('seeded_audits', JSON.stringify(fullAuditStorage));
  localStorage.setItem('last_seed_refresh', today);
};
