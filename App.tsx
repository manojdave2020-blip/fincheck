
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LeaderboardPage from './pages/LeaderboardPage';
import CreatorProfilePage from './pages/CreatorProfilePage';
import ClaimDetailPage from './pages/ClaimDetailPage';
import { seedDatabase } from './services/seedService';

const App: React.FC = () => {
  useEffect(() => {
    seedDatabase();
    // Force dark mode aesthetic by setting background on body
    document.body.className = 'bg-slate-950 text-slate-200 antialiased overflow-x-hidden';
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/creator/:id" element={<CreatorProfilePage />} />
          <Route path="/claim/:id" element={<ClaimDetailPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
