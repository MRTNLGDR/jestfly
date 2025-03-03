import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LogsPage from '@/pages/LogsPage';
import HomePage from '@/pages/HomePage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import { useAuth } from '@/contexts/AuthContext';

function App() {
  const { profile } = useAuth();
  
  // Creating default props for HomePage
  const homePageProps = {
    crystalParams: {
      preset: 'crystal',
      color: '#8A2BE2',
      roughness: 0.2,
      metalness: 0.8,
      emissive: '#4B0082',
      emissiveIntensity: 0.5
    },
    galleryImages: [
      '/textures/presets/crystal.jpg',
      '/textures/presets/holographic.jpg',
      '/textures/presets/glass.jpg'
    ]
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-purple-900">
      <Routes>
        <Route path="/" element={<HomePage {...homePageProps} />} />
        <Route path="/system/logs" element={<LogsPage />} />
        <Route path="/admin/logs" element={<LogsPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        {/* Adicionar outras rotas aqui conforme necessário */}
      </Routes>
    </div>
  );
}

export default App;
