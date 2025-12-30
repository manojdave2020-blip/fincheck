
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { GeminiService } from '../services/geminiService';
import { PredictionStatus } from '../types';

const CreatorProfilePage: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'videos' | 'claims'>('videos');
  
  // Initialize state from navigation or local storage
  const [creator, setCreator] = useState<any>(location.state?.creator || null);
  const [videos, setVideos] = useState<any[]>(location.state?.videos || []);
  const [claims, setClaims] = useState<any[]>([]);
  
  const [auditingVideoId, setAuditingVideoId] = useState<string | null>(null);
  const [verifyingClaimId, setVerifyingClaimId] = useState<string | null>(null);

  useEffect(() => {
    // If we land here without state, we need to handle it gracefully or redirected home
    if (!creator && id) {
       // Typically we'd re-fetch here, but for simplicity we'll assume state exists
       // or user is coming from the leaderboard.
    }
  }, [id, creator]);

  const timestampToSeconds = (ts: string) => {
    const parts = ts.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
  };

  const handleAuditVideo = async (video: any) => {
    if (auditingVideoId) return;
    setAuditingVideoId(video.id);
    
    const gemini = new GeminiService();
    try {
      const { claims: newClaims } = await gemini.extractVideoClaims(video.title, video.url);
      
      const processedClaims = newClaims.map((c, i) => ({
        ...c,
        id: `cl-${i}-${Date.now()}`,
        videoTitle: video.title,
        videoDate: video.date,
        videoUrl: video.url,
        status: "Pending Verification"
      }));

      setClaims(prev => [...prev, ...processedClaims]);
      setActiveTab('claims');
      
      // Mark video as audited locally
      setVideos(prev => prev.map(v => v.id === video.id ? { ...v, isAudited: true } : v));
    } catch (err) {
      console.error("Audit failed", err);
      alert("No verifiable financial claims detected in this specific video content.");
    } finally {
      setAuditingVideoId(null);
    }
  };

  const handleVerifyClaim = async (claim: any) => {
    if (verifyingClaimId) return;
    setVerifyingClaimId(claim.id);
    
    const gemini = new GeminiService();
    try {
      const result = await gemini.verifyClaim(claim.structuredClaim);
      setClaims(prev => prev.map(c => c.id === claim.id ? { ...c, ...result } : c));
    } catch (err) {
      console.error("Verification failed", err);
    } finally {
      setVerifyingClaimId(null);
    }
  };

  if (!creator) {
     return (
       <div className="p-20 text-center">
         <p className="text-slate-500 mb-4">No channel data found for this session.</p>
         <Link to="/" className="text-indigo-600 font-bold underline">Return Home</Link>
       </div>
     );
  }

  const verifiedClaims = claims.filter(c => c.status !== "Pending Verification");
  const avgAcc = verifiedClaims.length > 0 
    ? Math.round((verifiedClaims.reduce((acc, c) => acc + (c.score || 0), 0) / verifiedClaims.length) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header Profile Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-12 flex flex-col md:flex-row gap-8 items-center shadow-sm">
        <img src={creator.avatar} alt="" className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100" />
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{creator.name}</h1>
            <span className="text-slate-400 font-mono text-sm">{creator.handle}</span>
            <span className="ml-auto bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">
              Live Registry
            </span>
          </div>
          <p className="text-slate-600 mb-6 max-w-2xl">{creator.description}</p>
          <div className="flex gap-4">
             <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audited Claims</span>
                <span className="text-lg font-bold text-slate-900">{claims.length}</span>
             </div>
             <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audit Score</span>
                <span className="text-lg font-bold text-indigo-600">{avgAcc > 0 ? `${avgAcc}%` : '--'}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-slate-200 mb-10 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('videos')}
          className={`pb-4 px-1 text-sm font-bold transition-all border-b-2 ${activeTab === 'videos' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'}`}
        >
          Past Year Content ({videos.length})
        </button>
        <button 
          onClick={() => setActiveTab('claims')}
          className={`pb-4 px-1 text-sm font-bold transition-all border-b-2 ${activeTab === 'claims' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'}`}
        >
          Extracted Claims ({claims.length})
        </button>
      </div>

      {/* Tab Content: Videos List */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((video) => (
            <div key={video.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <h3 className="font-bold text-slate-900 mb-1 leading-snug">{video.title}</h3>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{video.date}</div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <a href={video.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-600 hover:underline">Watch Video</a>
                {video.isAudited ? (
                   <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">Audited</span>
                ) : (
                  <button 
                    onClick={() => handleAuditVideo(video)}
                    disabled={!!auditingVideoId}
                    className="text-xs font-bold text-white bg-slate-900 px-4 py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50"
                  >
                    {auditingVideoId === video.id ? 'Extracting Claims...' : 'Audit Content'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Claims List */}
      {activeTab === 'claims' && (
        <div className="space-y-6 max-w-4xl">
          {claims.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
               <p className="text-slate-400 font-medium">No claims extracted yet. Select a video to audit.</p>
               <button onClick={() => setActiveTab('videos')} className="mt-4 text-xs font-bold text-indigo-600 underline uppercase tracking-widest">Browse Videos</button>
            </div>
          ) : (
            claims.map((claim) => (
              <div key={claim.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 leading-tight">{claim.videoTitle}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{claim.videoDate}</span>
                      <span className="text-slate-300">•</span>
                      <a 
                        href={`${claim.videoUrl}&t=${timestampToSeconds(claim.timestamp)}s`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-indigo-600 text-[10px] font-bold uppercase tracking-widest hover:underline"
                      >
                        Source at {claim.timestamp}
                      </a>
                    </div>
                  </div>
                  {claim.status !== "Pending Verification" && (
                    <div className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${
                      claim.status === 'Accurate' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                      'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {claim.status} ({Math.round((claim.score || 0) * 100)}%)
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6 italic text-slate-600 text-sm">
                  "{claim.rawQuote}"
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <div className="text-xs text-slate-400 font-medium">Claim: <span className="text-slate-900 font-bold">{claim.structuredClaim}</span></div>
                  {claim.status === "Pending Verification" ? (
                    <button 
                      onClick={() => handleVerifyClaim(claim)}
                      disabled={!!verifyingClaimId}
                      className="text-xs font-bold text-white bg-slate-900 px-4 py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50"
                    >
                      {verifyingClaimId === claim.id ? 'Grounding...' : 'Verify Now'}
                    </button>
                  ) : (
                    <Link 
                      to={`/claim/${claim.id}`} 
                      state={{ prediction: claim }}
                      className="text-xs font-bold text-slate-900 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200"
                    >
                      View Receipts
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CreatorProfilePage;
