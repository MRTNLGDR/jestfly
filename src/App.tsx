import { Routes, Route } from 'react-router-dom';
import { Toaster } from "sonner";
import './App.css';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';
import JestCoinPage from './pages/JestCoinPage';
import ProfilePage from './pages/ProfilePage';
import CommunityPage from './pages/CommunityPage';
import AuthPage from './pages/AuthPage';
import AdminPanel from './pages/AdminPanel';
import LogsPage from './pages/LogsPage';
import BookingsPage from './pages/BookingsPage';
import DemoSubmissionPage from './pages/DemoSubmissionPage';
import PressKitPage from './pages/PressKitPage';
import AssetUploader from './pages/AssetUploader';
import AirdropPage from './pages/AirdropPage';
import LiveStreamPage from './pages/LiveStreamPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import NotFound from './pages/NotFound';
import GlassHeader from './components/GlassHeader';
import Footer from './components/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const defaultHomePageProps = {
    crystalParams: {
      size: 4,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      color: '#9b59b6',
      intensity: 1.5,
      speed: 1,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.9,
      thickness: 0.5,
      envMapIntensity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      ior: 2.33,
      attenuationColor: '#ffffff',
      attenuationDistance: 0,
      reflectivity: 0.5,
      iridescence: 1,
      iridescenceIOR: 1.5,
      sheen: 0,
      sheenRoughness: 0.1,
      sheenColor: '#ffffff',
      specularIntensity: 1,
      specularColor: '#ffffff',
      lightIntensity: 1,
      opacity: 1,
      transparent: true,
      textureMap: '',
      normalMap: '',
      roughnessMap: '',
      metalnessMap: '',
      emissiveMap: '',
      emissiveColor: '#000000',
      emissiveIntensity: 0,
      aoMap: '',
      aoMapIntensity: 1,
      displacementMap: '',
      displacementScale: 1,
      displacementBias: 0,
      wireframe: false,
      side: "front" as const,
    },
    galleryImages: [
      { src: '/placeholder.svg', alt: 'Placeholder 1', crystalPosition: "default" as const },
      { src: '/placeholder.svg', alt: 'Placeholder 2', crystalPosition: "top-left" as const },
      { src: '/placeholder.svg', alt: 'Placeholder 3', crystalPosition: "center" as const },
    ],
  };

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-black to-gray-900">
        <GlassHeader />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<HomePage {...defaultHomePageProps} />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/store/:productId" element={<ProductDetailPage />} />
            <Route path="/jestcoin" element={<JestCoinPage />} />
            <Route path="/community/*" element={<CommunityPage />} />
            <Route path="/bookings/*" element={<BookingsPage />} />
            <Route path="/demo-submission" element={<DemoSubmissionPage />} />
            <Route path="/press-kit" element={<PressKitPage />} />
            <Route path="/airdrop" element={<AirdropPage />} />
            <Route path="/live" element={<LiveStreamPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order/success" element={<OrderSuccessPage />} />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/logs" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <LogsPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/assets" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AssetUploader />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}

export default App;
