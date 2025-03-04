
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
import Loading from '../components/ui/loading';

const Index: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const authContext = useAuth();

  useEffect(() => {
    // Simulação de tempo de carregamento
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
        <div className="w-32 h-32 mb-8">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 animate-pulse blur-xl"></div>
        </div>
        <Loading size="lg" text="Carregando o ecossistema ORBVIR..." fullScreen={false} />
        <p className="mt-6 text-white/60 text-sm max-w-md text-center px-4">
          Conectando artistas, criadores e fãs em uma experiência digital única
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
              <span>Admin</span>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Index;
