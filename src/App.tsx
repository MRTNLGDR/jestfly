
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
import NotesPage from '@/pages/NotesPage';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import ResetPasswordConfirmPage from '@/pages/ResetPasswordConfirmPage';
import MainLayout from '@/components/layout/MainLayout';
import DashboardPage from '@/pages/DashboardPage';
import SettingsPage from '@/pages/SettingsPage';
import NotificationsPage from '@/pages/NotificationsPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import ModerationPage from '@/pages/ModerationPage';
import LogsPage from '@/pages/LogsPage';
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
          {/* Todas as rotas dentro do layout principal */}
          <Route element={<MainLayout />}>
            {/* Página inicial */}
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
            
            {/* Rotas de autenticação (agora dentro do layout principal) */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin/login" element={<AdminAuthPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/reset-password-confirm" element={<ResetPasswordConfirmPage />} />
            
            {/* Novas páginas do sistema */}
            <Route path="/dashboard" element={
              <ProtectedRoute requireAuth={true} resourceName="Dashboard">
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute requireAuth={true} resourceName="Configurações">
                <SettingsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/notifications" element={
              <ProtectedRoute requireAuth={true} resourceName="Notificações">
                <NotificationsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/analytics" element={
              <ProtectedRoute 
                requireAuth={true}
                allowedProfiles={['artist', 'admin']}
                resourceName="Analytics"
              >
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/moderation" element={
              <ProtectedRoute 
                requireAuth={true}
                allowedProfiles={['admin', 'collaborator']}
                resourceName="Moderação"
              >
                <ModerationPage />
              </ProtectedRoute>
            } />
            
            {/* Nova página de logs */}
            <Route path="/system/logs" element={
              <ProtectedRoute 
                requireAuth={true}
                allowedProfiles={['admin', 'collaborator']}
                resourceName="Logs do Sistema"
              >
                <LogsPage />
              </ProtectedRoute>
            } />
            
            {/* Rotas protegidas por autenticação (qualquer usuário logado) */}
            <Route path="/profile" element={
              <ProtectedRoute requireAuth={true} resourceName="Perfil">
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            <Route path="/notes" element={
              <ProtectedRoute requireAuth={true} resourceName="Notas">
                <NotesPage />
              </ProtectedRoute>
            } />
            
            {/* Rotas da comunidade (todos podem ver, usuarios autenticados podem interagir) */}
            <Route path="/community/*" element={<CommunityPage />} />
            
            {/* Loja (todos podem ver, usuários autenticados podem comprar) */}
            <Route path="/store" element={<StorePage />} />
            
            {/* Bookings (todos podem ver, artistas podem gerenciar) */}
            <Route path="/bookings" element={
              <ProtectedRoute 
                requireAuth={false} 
                allowedProfiles={['artist', 'admin']}
                resourceName="Reservas"
              >
                <BookingsPage />
              </ProtectedRoute>
            } />
            
            {/* Press Kit (todos podem ver, mas apenas usuários autenticados podem baixar recursos) */}
            <Route path="/press-kit" element={<PressKitPage />} />
            
            {/* Live Stream (todos podem assistir, artistas podem transmitir) */}
            <Route path="/live" element={
              <ProtectedRoute 
                requireAuth={false}
                allowedProfiles={['artist', 'admin']}
                resourceName="Live Stream"
              >
                <LiveStreamPage />
              </ProtectedRoute>
            } />
            
            {/* Airdrop (todos podem ver, usuários autenticados podem participar) */}
            <Route path="/airdrop" element={
              <ProtectedRoute 
                requireAuth={false}
                resourceName="Airdrop"
              >
                <AirdropPage />
              </ProtectedRoute>
            } />
            
            {/* Demo Submission (apenas artistas podem enviar) */}
            <Route path="/submit-demo" element={
              <ProtectedRoute 
                requiredRole="artist" 
                allowedProfiles={['artist', 'admin']}
                redirectPath="/"
                resourceName="Envio de Demo"
              >
                <DemoSubmissionPage />
              </ProtectedRoute>
            } />
            
            {/* Rotas adicionais para páginas do footer */}
            <Route path="/about" element={<NotFound />} />
            <Route path="/contact" element={<NotFound />} />
            <Route path="/faq" element={<NotFound />} />
            <Route path="/support" element={<NotFound />} />
            <Route path="/terms" element={<NotFound />} />
            <Route path="/privacy" element={<NotFound />} />
            
            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
          
          {/* Rota para o painel de administração (fora do layout principal) */}
          <Route path="/admin/*" element={
            <ProtectedRoute 
              requiredRole="admin" 
              redirectPath="/auth"
              resourceName="Painel Admin"
            >
              <AdminPanel />
            </ProtectedRoute>
          } />
        </Routes>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
