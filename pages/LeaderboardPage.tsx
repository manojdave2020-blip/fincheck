
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LeaderboardPage: React.FC = () => {
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('recent_searches') || '[]');
    setRecent(data);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Research Registry</h1>
        <p className="text-slate-500">Recently audited creators based on community queries.</p>
      </header>

      {recent.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-20 text-center">
           <p className="text-slate-400 font-medium mb-4">No audits performed yet.</p>
           <Link to="/" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl">Start Your First Audit</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map((creator) => (
            <div key={creator.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
              <img src={creator.avatar} alt="" className="w-12 h-12 rounded-xl bg-slate-50" />
              <div className="flex-grow">
                <h3 className="font-bold text-slate-900">{creator.name}</h3>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{creator.id}</p>
              </div>
              <Link 
                to={`/creator/${creator.id.replace('@','')}`} 
                className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200"
              >
                Audit
              </Link>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 leading-relaxed max-w-3xl">
        <strong>Dynamic Verification:</strong> Unlike static trackers, this platform generates results on-demand using Gemini 3 Pro grounding. Every audit represents a snapshot of the most recent verifiable data available at the time of query.
      </div>
    </div>
  );
};

export default LeaderboardPage;
