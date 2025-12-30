
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

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(prediction.videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">Verification Audit: {prediction.structuredClaim}</h1>
        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <span>{prediction.videoTitle}</span>
          <span>•</span>
          <span>{prediction.videoDate}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Audit Verdict</h3>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
               <div className="flex items-center gap-4 mb-6">
                 <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    prediction.status === 'Accurate' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                 }`}>
                   {prediction.status}
                 </div>
                 <div className="text-2xl font-bold text-slate-900">Score: {(prediction.score * 100).toFixed(0)}/100</div>
               </div>
               <p className="text-slate-600 leading-relaxed italic border-l-4 border-slate-100 pl-6 mb-8">
                 "{prediction.rawQuote}"
               </p>
               <p className="text-slate-700 font-medium bg-slate-50 p-6 rounded-xl border border-slate-100">
                 {prediction.explanation}
               </p>
            </div>
          </section>

          <section>
             <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Video Evidence</h3>
             <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
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
                    <th className="px-5 py-4 font-bold text-slate-400 uppercase">Price (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {prediction.marketData?.map((data: any, i: number) => (
                    <tr key={i}>
                      <td className="px-5 py-4 text-slate-600 font-medium">{data.date}</td>
                      <td className="px-5 py-4 text-slate-900 font-bold">{data.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Sourced via Gemini 3 Pro Search</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetailPage;
