
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { YouTubeService, ResolvedChannel } from '../services/youtubeService';

const FEATURED_CHANNELS = [
  { name: "Akshat Shrivastava", handle: "@AkshatZayn", niche: "Macro Strategy", avatar: "AS" },
  { name: "CA Rachana Ranade", handle: "@CARachanaRanade", niche: "Fundamental Analysis", avatar: "RR" },
  { name: "Pranjal Kamra", handle: "@PranjalKamra", niche: "Personal Finance", avatar: "PK" }
];

const HomePage: React.FC = () => {
  const [input, setInput] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [log, setLog] = useState<{msg: string, type: 'info' | 'success' | 'error'}[]>([]);
  const [detectedChannel, setDetectedChannel] = useState<ResolvedChannel | null>(null);
  const navigate = useNavigate();
  
  const ytService = new YouTubeService();

  const addLog = (msg: string, type: 'info' | 'success' | 'error' = 'info') => 
    setLog(prev => [...prev, { msg, type }]);

  const handleSearch = async (target: string) => {
    if (isResearching) return;
    setIsResearching(true);
    setLog([]);
    setDetectedChannel(null);

    try {
      addLog(`Initializing research probe for: ${target}...`);
      addLog(`Connecting to Google Search Grounding nodes...`);
      
      const channelData = await ytService.resolveChannel(target);
      
      addLog(`Identity confirmed: ${channelData.name}`, 'success');
      addLog(`Scanning metadata for ${channelData.handle}...`);
      addLog(`Retrieved ${channelData.recentVideos.length} prediction-eligible videos.`, 'success');
      
      setDetectedChannel(channelData);
      
      // Save to recent searches
      const recent = JSON.parse(localStorage.getItem('recent_searches') || '[]');
      const newEntry = { id: channelData.handle, name: channelData.name, avatar: channelData.avatar };
      localStorage.setItem('recent_searches', JSON.stringify([newEntry, ...recent.filter((r: any) => r.id !== newEntry.id)].slice(0, 10)));

    } catch (err: any) {
      addLog(`Error: ${err.message || "Failed to resolve entity. Check your API configuration."}`, 'error');
      console.error(err);
    } finally {
      setIsResearching(false);
    }
  };

  const confirmAndProceed = () => {
    if (!detectedChannel) return;
    navigate(`/creator/${detectedChannel.handle.replace('@', '')}`, { 
      state: { 
        creator: { ...detectedChannel },
        videos: detectedChannel.recentVideos
      } 
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 md:py-24">
      {/* Hero Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
          <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em]">Alpha Audit Engine</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
          Quantify the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Signal.</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          The public registry for financial accountability. Ingest any YouTube channel to audit their historical accuracy using live market grounding.
        </p>
      </div>

      {/* Main Search */}
      <div className="max-w-2xl mx-auto mb-20">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(input); }} 
            className="relative flex gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-2xl"
          >
            <input
              type="text"
              placeholder="Enter creator name or @handle..."
              className="flex-grow bg-transparent px-5 py-3 text-white outline-none placeholder:text-slate-600 font-medium"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isResearching}
            />
            <button
              type="submit"
              disabled={isResearching || !input.trim()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isResearching ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              <span>Audit</span>
            </button>
          </form>
        </div>

        {/* Discovery Engine Status Log */}
        {log.length > 0 && (
          <div className="mt-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 font-mono text-[11px] space-y-2 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4">
               <div className="text-slate-800 font-bold uppercase tracking-widest text-[9px]">Engine Status: Active</div>
            </div>
            {log.map((entry, i) => (
              <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2">
                <span className="text-slate-700 select-none">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                <span className={entry.type === 'success' ? 'text-emerald-400' : entry.type === 'error' ? 'text-rose-400' : 'text-slate-400'}>
                  {entry.type === 'error' ? '! ' : '> '}{entry.msg}
                </span>
              </div>
            ))}
            
            {/* Detection Card */}
            {detectedChannel && (
              <div className="mt-6 p-5 bg-indigo-500/5 border border-indigo-500/30 rounded-xl flex items-center gap-4 animate-in fade-in zoom-in duration-500">
                <img src={detectedChannel.avatar} className="w-14 h-14 rounded-lg shadow-lg border border-indigo-500/20" alt="" />
                <div className="flex-grow">
                  <h4 className="text-white font-bold text-sm">{detectedChannel.name}</h4>
                  <p className="text-indigo-400/60 text-[10px] uppercase tracking-wider font-bold">{detectedChannel.handle}</p>
                </div>
                <button 
                  onClick={confirmAndProceed}
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold text-xs hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
                >
                  Confirm Entity
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Suggested Ingestions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60 hover:opacity-100 transition-opacity">
        {FEATURED_CHANNELS.map((c) => (
          <button
            key={c.handle}
            onClick={() => handleSearch(c.handle)}
            disabled={isResearching}
            className="group bg-slate-900/40 border border-slate-800 p-6 rounded-2xl text-left hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all text-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center font-bold text-indigo-400 group-hover:scale-110 transition-transform">
                {c.avatar}
              </div>
              <div>
                <h3 className="text-white font-bold tracking-tight">{c.name}</h3>
                <span className="text-slate-500 text-[10px] font-mono">{c.handle}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-600 group-hover:text-indigo-400 transition-colors">
              <span>{c.niche}</span>
              <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">Quick Audit →</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
