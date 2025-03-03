
import React from 'react';
import { Outlet } from 'react-router-dom';
import GlassHeader from '@/components/GlassHeader';
import Footer from '@/components/Footer';
import { mainMenuItems } from '@/constants/menuItems';
import { Toaster } from '@/components/ui/toaster';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 flex flex-col">
      <GlassHeader menuItems={mainMenuItems} />
      <main className="pt-16 flex-grow">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default MainLayout;
