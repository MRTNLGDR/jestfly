
import React from 'react';
import GlassHeader from '../components/GlassHeader';
import Footer from '../components/Footer';
import JestCoinTicker from '../components/JestCoinTicker';
import { useAuth } from '@/contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <GlassHeader />
      
      {user && (
        <div className="fixed top-20 right-4 z-30 hidden md:block">
          <JestCoinTicker />
        </div>
      )}
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
