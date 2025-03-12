
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CommunityNav from '../components/community/CommunityNav';
import CommunityHome from '../components/community/CommunityHome';
import EventsPage from '../components/community/EventsPage';
import GiveawaysPage from '../components/community/GiveawaysPage';
import JestFlyersHubPage from '../components/community/JestFlyersHubPage';

const CommunityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 pt-20">
      <Routes>
        <Route path="/" element={<><CommunityNav /><CommunityHome /></>} />
        <Route path="/events" element={<><CommunityNav /><EventsPage /></>} />
        <Route path="/giveaways" element={<><CommunityNav /><GiveawaysPage /></>} />
        <Route path="/hub" element={<JestFlyersHubPage />} />
        <Route path="*" element={<Navigate to="/community" replace />} />
      </Routes>
    </div>
  );
};

export default CommunityPage;
