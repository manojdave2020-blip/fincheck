
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { YouTubeService, ResolvedChannel } from '../services/youtubeService';

const FEATURED_CHANNELS = [
  { name: "Akshat Shrivastava", handle: "@AkshatZayn", niche: "Macro Strategy", avatar: "AS" },
  { name: "CA Rachana Ranade", handle: "@CARachanaRanade", niche: "Stock Fundamentals", avatar: "RR" },
  { name: "Pranjal Kamra", handle: "@PranjalKamra", niche: "Wealth Management", avatar: "PK" }
];

const HomePage: React.FC = () => {
  const [input, setInput] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [log, setLog] = useState<{msg: string, type: 'info' | 'success' | 'error'}[]>([]);
  const [detectedChannel, setDetectedChannel] = useState<ResolvedChannel | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const ytService = new YouTubeService();

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  const addLog = (msg: string, type: 'info' | 'success' | 'error' = 'info') => 
    setLog(prev => [...prev, { msg, type }]);

  const handleSearch = async (target: string) => {
    if (isResearching) return;
    setIsResearching(true);
    setLog([]);
    setDetectedChannel(null);

    try {
      addLog(`[SYSTEM] Initializing Alpha Audit probe for target: ${target}`);
      addLog(`[GROUNDING] Establishing connection to Google Search nodes...`);
      
      const channelData = await ytService.resolveChannel(target);
      
      addLog(`[AUTH] Identity confirmed: ${channelData.name}`, 'success');
      addLog(`[SCAN] Parsing video metadata for ${channelData.handle}...`);
      addLog(`[SCAN] Found ${channelData.recentVideos.length} forecast-eligible assets.`, 'success');
      addLog(`[SYSTEM] Discovery complete. Awaiting entity confirmation.`);
      
      setDetectedChannel(channelData);
      
      const recent = JSON.parse(localStorage.getItem('recent_searches') || '[]');
      const newEntry = { id: channelData.handle, name: channelData.name, avatar: channelData.avatar };
      localStorage.setItem('recent_searches', JSON.stringify([newEntry, ...recent.filter((r: any) => r.id !== newEntry.id)].slice(0, 10)));

    } catch (err: any) {
      addLog(`[ERROR] ${err.message || "Protocol failure. Grounding interrupted."}`, 'error');
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
    <div className="max-w-5xl mx-auto px-4 py-12 md:py-24 animate-in fade-in duration-700">
      {/* Hero Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
          <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em]">Live Grounding Active</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
          Audit the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">Financial Web.</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
          Instantly evaluate creator accuracy using real-time market data. 
          The first accountability layer for financial content.
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
              placeholder="Search by name or @handle..."
              className="flex-grow bg-transparent px-5 py-4 text-white outline-none placeholder:text-slate-600 font-medium text-lg"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isResearching}
            />
            <button
              type="submit"
              disabled={isResearching || !input.trim()}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-3 shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              {isResearching ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              <span>Analyze</span>
            </button>
          </form>
        </div>

        {/* Discovery Engine Status Log */}
        {log.length > 0 && (
          <div className="mt-8 bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden relative border-t-indigo-500/30">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
               <div className="text-slate-500 font-mono text-[9px] uppercase tracking-widest">Discovery Engine v1.0.4</div>
               <div className="text-indigo-400 font-bold uppercase tracking-widest text-[9px] animate-pulse flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                  Process Active
               </div>
            </div>
            
            <div className="space-y-2.5 max-h-[180px] overflow-y-auto custom-scrollbar pr-2">
              {log.map((entry, i) => (
                <div key={i} className="flex gap-3 font-mono text-[11px] animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="text-slate-700 select-none">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                  <span className={entry.type === 'success' ? 'text-emerald-400' : entry.type === 'error' ? 'text-rose-400' : 'text-slate-400'}>
                    {entry.type === 'error' ? '× ' : entry.type === 'success' ? '✓ ' : '› '}{entry.msg}
                  </span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
            
            {/* Detection Card */}
            {detectedChannel && (
              <div className="mt-8 p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-xl flex items-center gap-5 animate-in fade-in zoom-in duration-500">
                <img src={detectedChannel.avatar} className="w-16 h-16 rounded-xl shadow-2xl border border-white/10" alt="" />
                <div className="flex-grow">
                  <h4 className="text-white font-bold text-base leading-tight">{detectedChannel.name}</h4>
                  <p className="text-indigo-400/80 text-[11px] uppercase tracking-wider font-mono font-bold mt-1">{detectedChannel.handle}</p>
                </div>
                <button 
                  onClick={confirmAndProceed}
                  className="bg-white text-indigo-950 px-6 py-3 rounded-lg font-bold text-xs hover:bg-slate-200 transition-all shadow-xl active:scale-95"
                >
                  Confirm & Audit
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
            className="group bg-slate-900/40 border border-slate-800 p-6 rounded-2xl text-left hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all text-sm relative overflow-hidden"
          >
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-indigo-400 group-hover:scale-110 transition-transform shadow-lg">
                {c.avatar}
              </div>
              <div>
                <h3 className="text-white font-bold tracking-tight">{c.name}</h3>
                <span className="text-slate-500 text-[10px] font-mono">{c.handle}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-600 group-hover:text-indigo-400 transition-colors relative z-10">
              <span>{c.niche}</span>
              <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">Quick Scan →</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
