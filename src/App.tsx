
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import LogsPage from '@/pages/LogsPage';
import HomePage from '@/pages/HomePage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import DashboardPage from '@/pages/DashboardPage';
import SettingsPage from '@/pages/SettingsPage';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function App() {
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
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-black to-purple-900">
        <Routes>
          <Route path="/" element={<HomePage {...homePageProps} />} />
          
          {/* Rotas públicas */}
          
          {/* Rotas protegidas */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Rotas administrativas */}
          <Route 
            path="/system/logs" 
            element={
              <ProtectedRoute allowedProfiles={['admin', 'collaborator']}>
                <LogsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/logs" 
            element={
              <ProtectedRoute allowedProfiles={['admin', 'collaborator']}>
                <LogsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedProfiles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Adicionar outras rotas aqui conforme necessário */}
        </Routes>
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;
