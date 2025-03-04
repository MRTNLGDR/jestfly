
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import CrystalHero from '../components/CrystalHero';
import ArtistShowcase from '../components/ArtistShowcase';
import NFTSection from '../components/NFTSection';
import EventsSection from '../components/EventsSection';
import RoadmapSection from '../components/RoadmapSection';
import CrystalGallery from '../components/CrystalGallery';
import ConnectionSection from '../components/ConnectionSection';
import ShopPreview from '../components/ShopPreview';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LoadingSpinner } from '../components/ui/loading';

const Index: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const authContext = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Longer loading time for animation

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
        <div className="relative h-24 w-24 animate-spin">
          <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
          <div className="absolute inset-0 rounded-full border-t-4 border-purple-500"></div>
        </div>
        <h1 className="mt-10 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
          JESTFLY
        </h1>
        <p className="mt-4 text-white/70 text-lg max-w-md text-center">
          Conectando artistas e fãs no ecossistema ORBVIR através de música, comunidade e inovação digital.
        </p>
      </div>
    );
  }

  return (
    <MainLayout>
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
        {authContext && authContext.user && authContext.user.email === "admin@example.com" && (
          <div className="fixed bottom-4 right-4 z-50">
            <Link 
              to="/admin" 
              className="bg-purple-800/80 backdrop-blur-sm text-white px-4 py-2 rounded-full 
                       flex items-center space-x-2 hover:bg-purple-700 transition-colors shadow-lg"
            >
              <span>{t('nav.admin')}</span>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Index;
