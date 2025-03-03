
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage';
import AdminAuthPage from '@/pages/AdminAuthPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminPanel from '@/pages/AdminPanel';
import CommunityPage from '@/pages/CommunityPage';
import StorePage from '@/pages/StorePage';
import BookingsPage from '@/pages/BookingsPage';
import PressKitPage from '@/pages/PressKitPage';
import LiveStreamPage from '@/pages/LiveStreamPage';
import AirdropPage from '@/pages/AirdropPage';
import DemoSubmissionPage from '@/pages/DemoSubmissionPage';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import ResetPasswordConfirmPage from '@/pages/ResetPasswordConfirmPage';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

// Dados de amostra para homepage
const sampleGalleryImages = [
  {
    src: '/placeholder.svg',
    alt: 'Imagem de amostra 1',
    crystalPosition: 'top-right' as const
  },
  {
    src: '/placeholder.svg',
    alt: 'Imagem de amostra 2',
    crystalPosition: 'bottom-left' as const
  },
  {
    src: '/placeholder.svg',
    alt: 'Imagem de amostra 3',
    crystalPosition: 'center' as const
  }
];

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<HomePage crystalParams={{
            color: "#ffffff",
            metalness: 0.1,
            roughness: 0.0,
            transmission: 0.98,
            thickness: 0.5,
            envMapIntensity: 2.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.0,
            ior: 2.75,
            reflectivity: 1.0,
            iridescence: 0.3,
            iridescenceIOR: 1.3,
            lightIntensity: 2.0,
            opacity: 0.9,
            transparent: true,
            emissiveIntensity: 0.2,
            emissiveColor: "#8B5CF6",
            aoMapIntensity: 1.0,
            displacementScale: 0.1,
            wireframe: false,
            side: 'front',
            textureMap: "",
            normalMap: "",
            roughnessMap: "",
            metalnessMap: "",
          }} galleryImages={sampleGalleryImages} />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin/login" element={<AdminAuthPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/reset-password-confirm" element={<ResetPasswordConfirmPage />} />
          
          {/* Rotas protegidas (requerem autenticação) */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/*" element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          } />
          
          {/* Outras rotas do aplicativo */}
          <Route path="/community/*" element={<CommunityPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/press-kit" element={<PressKitPage />} />
          <Route path="/live" element={<LiveStreamPage />} />
          <Route path="/airdrop" element={<AirdropPage />} />
          <Route path="/submit-demo" element={<DemoSubmissionPage />} />
          
          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
