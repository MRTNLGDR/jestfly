
import React from 'react';
import { Outlet } from 'react-router-dom';
import GlassHeader from '@/components/GlassHeader';
import { mainMenuItems } from '@/constants/menuItems';
import { Toaster } from '@/components/ui/toaster';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950">
      <GlassHeader menuItems={mainMenuItems} />
      <main className="pt-16">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};

export default MainLayout;
