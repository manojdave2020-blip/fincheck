
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">FT</span>
            </div>
            <span className="font-semibold text-slate-900 tracking-tight">FinFluencer Tracker</span>
          </Link>
          
          <div className="flex gap-6 text-sm font-medium text-slate-600">
            <Link 
              to="/" 
              className={`hover:text-slate-900 transition-colors ${location.pathname === '/' ? 'text-slate-900' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/leaderboard" 
              className={`hover:text-slate-900 transition-colors ${location.pathname === '/leaderboard' ? 'text-slate-900' : ''}`}
            >
              Leaderboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="border-t border-slate-200 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            Public Research Tool • Experimental Alpha • Deterministic Verification
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
