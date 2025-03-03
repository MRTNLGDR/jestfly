
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CommunityHome from '@/components/community/CommunityHome';
import EventsPage from '@/components/community/EventsPage';
import GiveawaysPage from '@/components/community/GiveawaysPage';
import JestFlyersHubPage from '@/components/community/JestFlyersHubPage';
import PostDetailPage from '@/components/community/PostDetailPage';
import NewPostPage from '@/components/community/NewPostPage';
import PostNotFound from '@/components/community/PostNotFound';
import CommunityNav from '@/components/community/CommunityNav';

const CommunityPage: React.FC = () => {
  return (
    <>
      <CommunityNav />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route index element={<CommunityHome />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="giveaways" element={<GiveawaysPage />} />
          <Route path="hub" element={<JestFlyersHubPage />} />
          <Route path="posts/:postId" element={<PostDetailPage />} />
          <Route path="new-post" element={<NewPostPage />} />
          <Route path="*" element={<Navigate to="/community" replace />} />
        </Routes>
      </div>
    </>
  );
};

export default CommunityPage;
