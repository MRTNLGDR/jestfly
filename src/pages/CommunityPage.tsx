
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CommunityHome from '@/components/community/CommunityHome';
import EventsPage from '@/components/community/EventsPage';
import GiveawaysPage from '@/components/community/GiveawaysPage';
import JestFlyersHubPage from '@/components/community/JestFlyersHubPage';
import PostDetailPage from '@/components/community/PostDetailPage';
import NewPostPage from '@/components/community/NewPostPage';
import GlassHeader from '@/components/GlassHeader';

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Comunidade", href: "/community" },
  { label: "Loja", href: "/store" },
  { label: "Bookings", href: "/bookings" },
  { label: "Demo", href: "/submit-demo" },
  { label: "Transmissão", href: "/live" },
  { label: "Press Kit", href: "/press-kit" },
  { label: "Airdrop", href: "/airdrop" }
];

const CommunityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950">
      <Routes>
        <Route index element={<CommunityHome />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/giveaways" element={<GiveawaysPage />} />
        <Route path="/hub" element={<JestFlyersHubPage />} />
        <Route path="/posts/:postId" element={<PostDetailPage />} />
        <Route path="/new-post" element={<NewPostPage />} />
      </Routes>
    </div>
  );
};

export default CommunityPage;
