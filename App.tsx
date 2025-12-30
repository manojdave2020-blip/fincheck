
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LeaderboardPage from './pages/LeaderboardPage';
import CreatorProfilePage from './pages/CreatorProfilePage';
import ClaimDetailPage from './pages/ClaimDetailPage';

const App: React.FC = () => {
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
