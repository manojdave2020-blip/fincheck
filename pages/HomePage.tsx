
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { YouTubeService } from '../services/youtubeService';
import { GeminiService } from '../services/geminiService';

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
    url: "https://www.youtube.com/channel/UCe3qdG0A_gr-sEdat5y2twQ",
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
  const [auditStats, setAuditStats] = useState<Record<string, any>>({});
  const navigate = useNavigate();
  
  const ytService = new YouTubeService();
  const gemini = new GeminiService();

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('audit_history') || '{}');
    setAuditStats(history);
  }, []);

  const addLog = (msg: string) => setLog(prev => [...prev, msg]);

  const performAudit = async (targetId: string, directUrl?: string) => {
    if (isResearching) return;

    const seededAudits = JSON.parse(localStorage.getItem('seeded_audits') || '{}');
    const cleanId = targetId.replace('@', '');
    if (seededAudits[cleanId]) {
       navigate(`/creator/${cleanId}`);
       return;
    }

    setIsResearching(true);
    setLog([]);

    try {
      addLog(`Connecting to ${targetId}...`);
      const channelData = await ytService.resolveChannel(directUrl || targetId);
      
      const filteredVideos = channelData.recentVideos;
      if (filteredVideos.length === 0) {
        addLog("No verifiable prediction videos found (filters: >6m + keywords).");
        setIsResearching(false);
        return;
      }

      addLog(`Found ${filteredVideos.length} matching videos. Extracting claims...`);
      const targetVideo = filteredVideos[0];
      const { claims, isAnalysisHeavy } = await gemini.extractVideoClaims(targetVideo.title, targetVideo.url);
      
      if (claims.length === 0) {
        addLog("No specific verifiable price targets found in this video.");
        setIsResearching(false);
        return;
      }

      addLog(`Success. ${claims.length} claims identified.`);
      
      const today = new Date().toLocaleDateString();
      const history = JSON.parse(localStorage.getItem('audit_history') || '{}');
      history[channelData.handle] = { 
        count: claims.length, 
        lastAudited: today,
        status: "Completed"
      };
      localStorage.setItem('audit_history', JSON.stringify(history));

      const recent = JSON.parse(localStorage.getItem('recent_searches') || '[]');
      const newEntry = { id: channelData.handle, name: channelData.name, avatar: channelData.avatar };
      localStorage.setItem('recent_searches', JSON.stringify([newEntry, ...recent.filter((r: any) => r.id !== newEntry.id)].slice(0, 10)));

      navigate(`/creator/${channelData.handle.replace('@', '')}`, { 
        state: { 
          creator: { ...channelData, isAnalysisHeavy, totalPredictions: claims.length },
          claims: claims.map((c, i) => ({
            ...c,
            id: `cl-${i}-${Date.now()}`,
            videoTitle: targetVideo.title,
            videoDate: targetVideo.date,
            videoUrl: targetVideo.url,
            status: "Pending Verification"
          }))
        } 
      });
    } catch (err: any) {
      console.error("Audit failed:", err);
      addLog(`Error: ${err.message || "Pipeline interrupted."}`);
      addLog("Check: Is API_KEY set in Vercel? Is the model available?");
      setIsResearching(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-6 border border-indigo-100">
          Deterministic Accuracy Engine
        </div>
        <h1 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight">
          Audit the <span className="text-indigo-600">FinFluencers.</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          We use AI to extract price targets and real-time market data to verify them. 
          Audits auto-refresh daily to reflect current market performance.
        </p>
      </div>

      <div className="mb-16">
        <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Featured Creators</h2>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Live Audit Status</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRELOADED_CREATORS.map((c) => {
            const stats = auditStats[c.handle];
            return (
              <button
                key={c.handle}
                onClick={() => performAudit(c.handle, c.url)}
                disabled={isResearching}
                className="group bg-white border border-slate-200 p-6 rounded-3xl text-left hover:border-indigo-400 hover:shadow-xl transition-all disabled:opacity-50 relative overflow-hidden"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img src={c.avatar} className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100" alt={c.name} />
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">{c.name}</h3>
                    <span className="text-[10px] text-indigo-500 font-mono tracking-tight">{c.handle}</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                    {stats ? (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 uppercase">
                        {stats.status || 'COMPLETED'}
                      </span>
                    ) : (
                      <span className="bg-slate-50 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-100 uppercase">
                        PENDING
                      </span>
                    )}
                  </div>
                  
                  {stats && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600">{stats.count} Verifiable Claims</span>
                      </div>
                      <div className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">
                        Auto-Refreshed: {stats.lastAudited}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{c.niche}</span>
                  <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative py-8 flex items-center gap-4 text-slate-300">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="text-[10px] font-bold uppercase tracking-widest">Custom Audit</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); performAudit(input); }} className="max-w-2xl mx-auto flex gap-3 mt-8">
        <input
          type="text"
          placeholder="YouTube URL or @handle..."
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
          {isResearching ? 'Auditing...' : 'Analyze'}
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
