
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { YouTubeService } from '../services/youtubeService';

const PRELOADED_CREATORS = [
  {
    name: "Akshat Shrivastava",
    handle: "@AkshatZayn",
    url: "https://www.youtube.com/@AkshatZayn",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Akshat&backgroundColor=b6e3f4",
    niche: "Macro & Strategy"
  },
  {
    name: "CA Rachana Ranade",
    handle: "@CARachanaRanade",
    url: "https://www.youtube.com/@CARachanaRanade",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Rachana&backgroundColor=ffdfbf",
    niche: "Stock Analysis"
  },
  {
    name: "Udayan Adhye",
    handle: "@udayanadhye",
    url: "https://www.youtube.com/@udayanadhye",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Udayan&backgroundColor=d1d4f9",
    niche: "Equity Research"
  }
];

const HomePage: React.FC = () => {
  const [input, setInput] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const ytService = new YouTubeService();

  const addLog = (msg: string) => setLog(prev => [...prev, msg]);

  const startChannelResolution = async (targetId: string, directUrl?: string) => {
    if (isResearching) return;

    setIsResearching(true);
    setLog([]);

    try {
      addLog(`Resolving channel for ${targetId}...`);
      const channelData = await ytService.resolveChannel(directUrl || targetId);
      addLog(`Found ${channelData.name}. Accessing video library...`);
      addLog(`Success! Retrived ${channelData.recentVideos.length} videos from the past year.`);
      
      const recent = JSON.parse(localStorage.getItem('recent_searches') || '[]');
      const newEntry = { id: channelData.handle, name: channelData.name, avatar: channelData.avatar };
      localStorage.setItem('recent_searches', JSON.stringify([newEntry, ...recent.filter((r: any) => r.id !== newEntry.id)].slice(0, 10)));

      // Redirect to profile with video list
      navigate(`/creator/${channelData.handle.replace('@', '')}`, { 
        state: { 
          creator: { ...channelData },
          videos: channelData.recentVideos
        } 
      });
    } catch (err: any) {
      console.error("Resolution failed:", err);
      addLog(`Error: ${err.message || "Failed to find channel data."}`);
      setIsResearching(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 border border-indigo-100">
          Accuracy Registry v2
        </div>
        <h1 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
          Trust, but <span className="text-indigo-600 italic">Audit.</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Audit any FinFluencer's predictions from the past year. Extract claims from specific videos and verify them against live market results.
        </p>
      </div>

      <div className="mb-16">
        <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select to Review Videos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRELOADED_CREATORS.map((c) => (
            <button
              key={c.handle}
              onClick={() => startChannelResolution(c.handle, c.url)}
              disabled={isResearching}
              className="group bg-white border border-slate-200 p-6 rounded-3xl text-left hover:border-indigo-400 hover:shadow-xl transition-all disabled:opacity-50"
            >
              <div className="flex items-center gap-4 mb-4">
                <img src={c.avatar} className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100" alt={c.name} />
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">{c.name}</h3>
                  <span className="text-[10px] text-indigo-500 font-mono tracking-tight">{c.handle}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{c.niche}</span>
                <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">Browse Content →</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); startChannelResolution(input); }} className="max-w-2xl mx-auto flex gap-3 mt-8">
        <input
          type="text"
          placeholder="Enter Channel @handle or URL..."
          className="flex-grow px-6 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-lg shadow-sm bg-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isResearching}
        />
        <button
          type="submit"
          disabled={isResearching || !input.trim()}
          className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all disabled:opacity-50 shadow-lg"
        >
          {isResearching ? 'Accessing...' : 'Review Channel'}
        </button>
      </form>

      {log.length > 0 && (
        <div className="mt-12 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl font-mono text-xs max-w-2xl mx-auto">
          {log.map((entry, i) => (
            <div key={i} className="text-slate-400 mb-1 flex gap-2">
              <span className="text-slate-600 select-none">›</span>
              <span className={i === log.length - 1 ? (entry.startsWith('Error') ? "text-rose-400" : "text-indigo-400") : ""}>{entry}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
