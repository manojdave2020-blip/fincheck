
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { GeminiService } from '../services/geminiService';
import { PredictionStatus } from '../types';

const CreatorProfilePage: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'timeline' | 'accuracy'>('timeline');
  const [claims, setClaims] = useState<any[]>(location.state?.claims || []);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const creator = location.state?.creator || {
    name: id,
    handle: `@${id}`,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${id}`,
    description: "Researching channel profile...",
    totalPredictions: 0,
    isAnalysisHeavy: false,
    avgAccuracy: 0
  };

  const handleVerify = async (claimId: string, text: string) => {
    if (verifyingId) return;
    setVerifyingId(claimId);
    
    const gemini = new GeminiService();
    try {
      const result = await gemini.verifyClaim(text);
      setClaims(prev => prev.map(c => c.id === claimId ? { ...c, ...result } : c));
    } catch (err) {
      console.error("Verification failed", err);
    } finally {
      setVerifyingId(null);
    }
  };

  if (!location.state?.creator && id !== 'dynamic') {
     return <div className="p-20 text-center"><Link to="/" className="text-indigo-600 font-bold">Start a search on the home page</Link> to research this creator.</div>;
  }

  const sortedClaims = activeTab === 'accuracy' 
    ? [...claims].sort((a, b) => (b.score || 0) - (a.score || 0))
    : [...claims];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-12 flex flex-col md:flex-row gap-8 items-center shadow-sm">
        <img src={creator.avatar} alt="" className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100" />
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{creator.name}</h1>
            <span className="text-slate-400 font-mono text-sm">{creator.handle}</span>
          </div>
          <p className="text-slate-600 mb-6 max-w-2xl">{creator.description}</p>
          <div className="flex gap-4">
             <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Claims</span>
                <span className="text-lg font-bold text-slate-900">{claims.length}</span>
             </div>
             <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Status</span>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${creator.isAnalysisHeavy ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {creator.isAnalysisHeavy ? 'High Volume' : 'Focused Signal'}
                </span>
             </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8 border-b border-slate-200 mb-10 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('timeline')}
          className={`pb-4 px-1 text-sm font-bold transition-all border-b-2 ${activeTab === 'timeline' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'}`}
        >
          Extracted Claims
        </button>
        <button 
          onClick={() => setActiveTab('accuracy')}
          className={`pb-4 px-1 text-sm font-bold transition-all border-b-2 ${activeTab === 'accuracy' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'}`}
        >
          By Verification Score
        </button>
      </div>

      <div className="space-y-6 max-w-4xl">
        {sortedClaims.map((claim) => (
          <div key={claim.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-slate-400 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-slate-900 mb-1">{claim.videoTitle}</h3>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{claim.videoDate} • {claim.timestamp}</p>
              </div>
              {claim.status !== "Pending Verification" ? (
                <div className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${
                  claim.status === 'Accurate' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                }`}>
                  {claim.status}
                </div>
              ) : null}
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6 italic text-slate-600 text-sm">
              "{claim.rawQuote}"
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
               <div className="text-xs text-slate-400 font-medium">Target: <span className="text-slate-900 font-bold">{claim.structuredClaim}</span></div>
               {claim.status === "Pending Verification" ? (
                 <button 
                   onClick={() => handleVerify(claim.id, claim.structuredClaim)}
                   disabled={verifyingId === claim.id}
                   className="text-xs font-bold text-white bg-slate-900 px-4 py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50"
                 >
                   {verifyingId === claim.id ? 'Verifying...' : 'Verify Real-Time'}
                 </button>
               ) : (
                 <Link 
                   to={`/claim/${claim.id}`} 
                   state={{ prediction: claim }}
                   className="text-xs font-bold text-slate-900 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200"
                 >
                   View Detailed Receipts
                 </Link>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatorProfilePage;
