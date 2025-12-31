
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-white tracking-tight text-lg">FinFluencer Audit</span>
          </Link>
          
          <div className="flex gap-8 text-sm font-semibold">
            <Link 
              to="/" 
              className={`transition-colors ${location.pathname === '/' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
            >
              Scanner
            </Link>
            <Link 
              to="/leaderboard" 
              className={`transition-colors ${location.pathname === '/leaderboard' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
            >
              Registry
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="border-t border-slate-900 py-10 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs font-medium tracking-wide">
            © 2024 Audit Engine • Powered by Gemini 3 Flash Grounding
          </p>
          <div className="flex gap-4">
             <span className="text-[10px] bg-slate-900 px-2 py-1 rounded text-slate-500 font-mono border border-slate-800">STATUS: OPERATIONAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
