
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { YouTubeService } from '../services/youtubeService';
import { GeminiService } from '../services/geminiService';

const FEATURED_CREATORS = [
  {
    name: "Akshat Shrivastava",
    handle: "@AkshatZayn",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Akshat&backgroundColor=b6e3f4",
    niche: "Macro & Strategy",
    url: "https://www.youtube.com/@AkshatZayn"
  },
  {
    name: "CA Rachana Ranade",
    handle: "@CARachanaRanade",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Rachana&backgroundColor=ffdfbf",
    niche: "Stock Analysis",
    url: "https://www.youtube.com/channel/UCe3qdG0A_gr-sEdat5y2twQ"
  },
  {
    name: "Udayan Adhye",
    handle: "@udayanadhye",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Udayan&backgroundColor=d1d4f9",
    niche: "Equity Research",
    url: "https://www.youtube.com/@udayanadhye"
  }
];

const HomePage: React.FC = () => {
  const [input, setInput] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [auditStats, setAuditStats] = useState<Record<string, any>>({});
  const navigate = useNavigate();
  
  const ytService = new YouTubeService();
  const gemini = new GeminiService();

  useEffect(() => {
    // Load existing audit summaries to show on featured cards
    const history = JSON.parse(localStorage.getItem('audit_history') || '{}');
    setAuditStats(history);
  }, []);

  const addLog = (msg: string) => setLog(prev => [...prev, msg]);

  const performAudit = async (targetHandle: string) => {
    if (isResearching) return;
    
    setIsResearching(true);
    setLog([]);

    try {
      addLog(`Initializing research on ${targetHandle}...`);
      const channelData = await ytService.resolveChannel(targetHandle);
      addLog(`Connected to ${channelData.name}. Applying smart filters...`);
      
      const filteredVideos = channelData.recentVideos;
      if (filteredVideos.length === 0) {
        addLog("No prediction-rich videos found matching the criteria (>6m, keywords).");
        setIsResearching(false);
        return;
      }

      addLog(`Selected ${filteredVideos.length} videos for analysis. Processing primary source...`);
      const targetVideo = filteredVideos[0];
      
      const { claims, isAnalysisHeavy } = await gemini.extractVideoClaims(targetVideo.title, targetVideo.url);
      
      if (claims.length === 0) {
        addLog("No specific verifiable price targets detected in recent content.");
        setIsResearching(false);
        return;
      }

      addLog(`Success. Extracted ${claims.length} verifiable claims.`);
      
      // Update local storage for registry/leaderboard
      const recent = JSON.parse(localStorage.getItem('recent_searches') || '[]');
      const newEntry = { id: channelData.handle, name: channelData.name, avatar: channelData.avatar };
      localStorage.setItem('recent_searches', JSON.stringify([newEntry, ...recent.filter((r: any) => r.id !== newEntry.id)].slice(0, 5)));

      // Update audit stats for the featured cards
      const history = JSON.parse(localStorage.getItem('audit_history') || '{}');
      history[channelData.handle] = { count: claims.length, lastAudited: new Date().toLocaleDateString() };
      localStorage.setItem('audit_history', JSON.stringify(history));

      navigate(`/creator/${channelData.handle.replace('@', '')}`, { 
        state: { 
          creator: { ...channelData, isAnalysisHeavy, totalPredictions: claims.length },
          claims: claims.map((c, i) => ({
            ...c,
            id: `dyn-${i}-${Date.now()}`,
            videoTitle: targetVideo.title,
            videoDate: targetVideo.date,
            videoUrl: targetVideo.url,
            status: "Pending Verification",
            score: 0
          }))
        } 
      });
    } catch (err) {
      console.error(err);
      addLog("System Error: The audit pipeline encountered a terminal issue.");
      setIsResearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (input) performAudit(input);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/5 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 border border-slate-200">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Real-Time Audit Engine
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
            Financial Content, <br/><span className="text-indigo-600">Verified by AI.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            We extract price targets from YouTube transcripts and verify them against live market data. No bias, just math.
          </p>

          <div className="mb-12">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8 text-center">Featured Creators</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FEATURED_CREATORS.map((creator) => {
                const stats = auditStats[creator.handle];
                return (
                  <button
                    key={creator.handle}
                    onClick={() => performAudit(creator.handle)}
                    disabled={isResearching}
                    className="group bg-white border border-slate-200 p-6 rounded-3xl text-left hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-50/50 transition-all disabled:opacity-50 relative overflow-hidden"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img src={creator.avatar} alt="" className="w-12 h-12 rounded-xl border border-slate-100 shadow-sm" />
                      <div>
                        <h3 className="font-bold text-slate-900 leading-tight">{creator.name}</h3>
                        <a href={creator.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-indigo-500 uppercase tracking-widest hover:underline" onClick={(e) => e.stopPropagation()}>
                          YouTube Channel
                        </a>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      {stats ? (
                        <div className="flex items-center gap-2">
                           <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                           <span className="text-xs font-bold text-slate-600">{stats.count} Claims Audited</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                           <span className="w-2 h-2 bg-slate-200 rounded-full"></span>
                           <span className="text-xs font-bold text-slate-400">Not audited yet</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{creator.niche}</span>
                      <span className="text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        Audit Now
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative py-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest"><span className="bg-[#F8F9FA] px-4 text-slate-400">Or Audit Any Custom Creator</span></div>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mt-8 max-w-2xl mx-auto">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="YouTube URL or @handle..."
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white shadow-sm text-slate-900 text-lg"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isResearching}
              />
            </div>
            <button
              type="submit"
              disabled={isResearching}
              className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all disabled:opacity-50 min-w-[200px] shadow-lg"
            >
              {isResearching ? 'Processing...' : 'Analyze Creator'}
            </button>
          </form>

          {log.length > 0 && (
            <div className="mt-12 bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-2xl font-mono text-[13px] text-left max-w-2xl mx-auto">
              {log.map((entry, i) => (
                <div key={i} className="text-slate-400 mb-1 flex gap-3 animate-in slide-in-from-bottom-2 duration-300">
                  <span className="text-slate-600 shrink-0">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                  <span className={i === log.length - 1 ? "text-emerald-400" : ""}>{entry}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
