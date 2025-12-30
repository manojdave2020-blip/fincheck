
import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';

const ClaimDetailPage: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const prediction = location.state?.prediction;

  if (!prediction) return (
    <div className="p-20 text-center">
      <p className="text-slate-500 mb-4">Claim receipts require live verification state.</p>
      <Link to="/" className="text-indigo-600 font-bold underline">Go back home</Link>
    </div>
  );

  const timestampToSeconds = (ts: string) => {
    const parts = ts.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
  };

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(prediction.videoUrl);
  const startSeconds = timestampToSeconds(prediction.timestamp);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&autoplay=0` : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <header className="mb-10">
        <Link to={-1 as any} className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4 inline-block hover:underline">← Back to Profile</Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">Verification Audit: {prediction.structuredClaim}</h1>
        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <span className="text-slate-900">{prediction.videoTitle}</span>
          <span>•</span>
          <span>{prediction.videoDate}</span>
          <span>•</span>
          <span className="text-indigo-600 font-mono">Timestamp: {prediction.timestamp}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Transcript Receipt</h3>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-4">
                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        prediction.status === 'Accurate' ? 'bg-emerald-500 text-white' : 
                        prediction.status === 'Partially Accurate' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                    }`}>
                      {prediction.status}
                    </div>
                    <div className="text-2xl font-bold text-slate-900">Score: {(prediction.score * 100).toFixed(0)}/100</div>
                 </div>
                 <a 
                    href={`${prediction.videoUrl}&t=${startSeconds}s`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-indigo-600 underline uppercase tracking-widest"
                 >
                   Verify on YouTube
                 </a>
               </div>
               <div className="relative">
                 <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-500 rounded-full"></div>
                 <p className="text-lg text-slate-600 leading-relaxed italic pl-6 mb-8 font-serif">
                   "{prediction.rawQuote}"
                 </p>
               </div>
               <div className="mt-8 pt-8 border-t border-slate-50">
                 <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Auditor Logic</h4>
                 <p className="text-slate-700 font-medium bg-slate-50 p-6 rounded-xl border border-slate-100">
                   {prediction.explanation}
                 </p>
               </div>
            </div>
          </section>

          <section>
             <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Video Evidence (Starting at {prediction.timestamp})</h3>
             <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
               {embedUrl && (
                 <iframe 
                    width="100%" 
                    height="100%" 
                    src={embedUrl} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  ></iframe>
               )}
             </div>
          </section>
        </div>

        <div className="space-y-10">
          <section>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Market Data Proof</h3>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-4 font-bold text-slate-400 uppercase">Snapshot Date</th>
                    <th className="px-5 py-4 font-bold text-slate-400 uppercase">Price (Verified)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {prediction.marketData?.map((data: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 text-slate-600 font-medium">{data.date}</td>
                      <td className="px-5 py-4 text-slate-900 font-bold font-mono">{data.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Live Grounding: Gemini 3 Pro Search</p>
              </div>
            </div>
          </section>

          <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl">
             <h4 className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest mb-2">Accuracy Note</h4>
             <p className="text-[11px] text-indigo-700 leading-relaxed">
               This verification uses Google Search grounding to pull price points from the exact dates mentioned in the transcript.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetailPage;
