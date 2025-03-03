
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/auth';
import { LanguageProvider } from './contexts/language';
import { Toaster } from 'sonner';
import { ModelParameters } from './types/model';
import { Diamond } from 'lucide-react';
import { Link } from 'react-router-dom';

// Navigation Components
const MainHeader = () => (
  <header className="fixed top-0 left-0 right-0 bg-black/70 backdrop-blur-xl border-b border-white/10 z-50">
    <div className="container mx-auto flex items-center justify-between py-4 px-4">
      {/* Logo and welcome message */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="flex items-center text-white">
          <Diamond className="h-6 w-6 text-white" />
        </Link>
        <div className="hidden md:block">
          <div className="text-xs text-white/60 uppercase">h1.welcome to the</div>
          <div className="text-sm text-white uppercase font-semibold">FUTURE</div>
        </div>
      </div>
      
      {/* Main Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        <Link to="/" className="text-white/80 hover:text-white text-sm uppercase">Início</Link>
        <Link to="/store" className="text-white/80 hover:text-white text-sm uppercase">Store</Link>
        <Link to="/community" className="text-white/80 hover:text-white text-sm uppercase">Community</Link>
        <Link to="/bookings" className="text-white/80 hover:text-white text-sm uppercase">Bookings</Link>
        <Link to="/resources" className="text-white/80 hover:text-white text-sm uppercase">Resources</Link>
        <Link to="/notes" className="text-white/80 hover:text-white text-sm uppercase">Notes</Link>
        <Link to="/demo-submission" className="text-white/80 hover:text-white text-sm uppercase">Demo Submission</Link>
        <Link to="/press-kit" className="text-white/80 hover:text-white text-sm uppercase">Press Kit</Link>
      </nav>
      
      {/* User Controls */}
      <div className="flex items-center space-x-4">
        <Link to="/profile" className="text-white/80 hover:text-white text-sm uppercase hidden md:block">Profile</Link>
        <Link to="/live-stream" className="text-white/80 hover:text-white text-sm uppercase hidden md:block">Live Stream</Link>
        <Link to="/airdrop" className="text-white/80 hover:text-white text-sm uppercase hidden md:block">Airdrop</Link>
        
        {/* Authentication Links */}
        <Link to="/login" className="bg-purple-600 text-white text-sm font-medium px-4 py-1.5 rounded-md hover:bg-purple-700 transition-colors">
          LOGIN
        </Link>
        
        {/* Currency Controls */}
        <div className="flex items-center space-x-2 text-white">
          <span>[PR</span>
          <span className="text-sm">@</span>
          <span>$</span>
          <span>+</span>
          <span>-</span>
        </div>
        
        {/* Pre-Order Button */}
        <div className="bg-black border border-white/20 rounded-full flex items-center">
          <div className="bg-black px-2 py-1 text-xs text-white">
            PRE-ORDER
          </div>
          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-black">
            7
          </div>
        </div>
      </div>
    </div>
  </header>
);

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));

// Define default values for HomePage props
const defaultCrystalParams: ModelParameters = {
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
  metalnessMap: ""
};

const defaultGalleryImages = [
  { 
    src: '/assets/dj-event.jpg', 
    alt: 'DJ event', 
    crystalPosition: 'top-right' as const 
  },
  { 
    src: '/assets/studio-session.jpg', 
    alt: 'Studio session', 
    crystalPosition: 'bottom-left' as const 
  },
  { 
    src: '/assets/consultation.jpg', 
    alt: 'Artist consultation', 
    crystalPosition: 'center' as const 
  }
];

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <div className="App min-h-screen flex flex-col">
            <MainHeader />
            <main className="flex-1 pt-16"> {/* Add padding top to account for fixed header */}
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<HomePage crystalParams={defaultCrystalParams} galleryImages={defaultGalleryImages} />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                </Routes>
              </Suspense>
            </main>
            <Toaster position="top-right" />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
