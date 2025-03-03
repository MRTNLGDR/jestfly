
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Footer from '../components/Footer';
import CommunityNav from '../components/community/CommunityNav';
import CommunityHome from '../components/community/CommunityHome';
import EventsPage from '../components/community/EventsPage';
import GiveawaysPage from '../components/community/GiveawaysPage';
import JestFlyersHubPage from '../components/community/JestFlyersHubPage';

const CommunityPage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Mark as loaded as soon as the component mounts
    setIsLoaded(true);
    
    // Log for diagnostics
    console.log("CommunityPage mounted successfully");
    
    return () => {
      console.log("CommunityPage unmounted");
    };
  }, []);

  // If we have rendering problems, we can see in the console
  console.log("Rendering CommunityPage, loaded:", isLoaded);

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Community Nav */}
      <CommunityNav />
      
      <div className="container mx-auto pb-20">
        <Routes>
          <Route path="/" element={<CommunityHome />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/giveaways" element={<GiveawaysPage />} />
          <Route path="/hub" element={<JestFlyersHubPage />} />
        </Routes>
      </div>
      
      <Footer />
    </div>
  );
};

export default CommunityPage;
