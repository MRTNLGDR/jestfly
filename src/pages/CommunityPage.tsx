
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from '@/components/Footer';
import GlassHeader from '@/components/GlassHeader';
import CommunityHome from '@/components/community/CommunityHome';
import EventsPage from '@/components/community/EventsPage';
import GiveawaysPage from '@/components/community/GiveawaysPage';
import JestFlyersHubPage from '@/components/community/JestFlyersHubPage';
import PostDetailPage from '@/components/community/PostDetailPage';
import NewPostPage from '@/components/community/NewPostPage';
import CommunityNav from '@/components/community/CommunityNav';

const CommunityPage: React.FC = () => {
  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Community', href: '/community' },
    { label: 'Store', href: '/store' },
    { label: 'Events', href: '/community/events' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900/20">
      <GlassHeader menuItems={menuItems} />
      
      <main className="container mx-auto px-4 pt-20 pb-20">
        <CommunityNav />
        
        <Routes>
          <Route index element={<CommunityHome />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="giveaways" element={<GiveawaysPage />} />
          <Route path="hub" element={<JestFlyersHubPage />} />
          <Route path="post/:postId" element={<PostDetailPage />} />
          <Route path="new-post" element={<NewPostPage />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
};

export default CommunityPage;
