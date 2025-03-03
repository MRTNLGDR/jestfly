
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/auth';
import { LanguageProvider } from './contexts/language';
import { Toaster } from 'sonner';

// Create simple placeholder components for temporary use
const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const SimpleHeader = () => (
  <header className="bg-black/70 backdrop-blur-xl border-b border-white/20 shadow-lg p-4">
    <div className="container mx-auto">
      <h1 className="text-xl font-bold text-white">JESTFLY</h1>
    </div>
  </header>
);

const SimpleFooter = () => (
  <footer className="bg-black/70 backdrop-blur-xl border-t border-white/20 shadow-lg p-4 mt-auto">
    <div className="container mx-auto">
      <p className="text-center text-white/70 text-sm">© {new Date().getFullYear()} JESTFLY. All rights reserved.</p>
    </div>
  </footer>
);

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <div className="App min-h-screen flex flex-col">
            <SimpleHeader />
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
              </Routes>
            </Suspense>
            <SimpleFooter />
            <Toaster position="top-right" />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
