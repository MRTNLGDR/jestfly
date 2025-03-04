
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CrystalHero from '../components/CrystalHero';
import ArtistShowcase from '../components/ArtistShowcase';
import NFTSection from '../components/NFTSection';
import EventsSection from '../components/EventsSection';
import RoadmapSection from '../components/RoadmapSection';
import CrystalGallery from '../components/CrystalGallery';
import ConnectionSection from '../components/ConnectionSection';
import ShopPreview from '../components/ShopPreview';
import { useAuth } from '../contexts/AuthContext';

const Index: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative bg-black min-h-screen text-white overflow-hidden">
      {/* Hero Section */}
      <CrystalHero />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 space-y-24">
        {/* Featured Artists */}
        <ArtistShowcase />
        
        {/* NFT Section */}
        <NFTSection />
        
        {/* Events Section */}
        <EventsSection />
        
        {/* Roadmap / Timeline */}
        <RoadmapSection />
        
        {/* Crystal Gallery */}
        <CrystalGallery />
        
        {/* Shop Preview */}
        <ShopPreview />
        
        {/* Newsletter / Connection */}
        <ConnectionSection />
      </div>
      
      {/* Admin Link - only visible to admins */}
      {user && user.email === "admin@example.com" && (
        <div className="fixed bottom-4 right-4 z-50">
          <Link 
            to="/admin" 
            className="bg-purple-800/80 backdrop-blur-sm text-white px-4 py-2 rounded-full 
                     flex items-center space-x-2 hover:bg-purple-700 transition-colors shadow-lg"
          >
            <span>Admin</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Index;
