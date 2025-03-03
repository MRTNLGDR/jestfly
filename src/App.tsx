
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProfilePage from './pages/ProfilePage';
import NotesPage from './pages/NotesPage';
import AdminPage from './pages/AdminPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from 'sonner';
import { defaultModelParams } from './types/modelParameters';

// Create properly formatted gallery images
const mockGalleryImages = [
  {
    src: '/textures/presets/crystal.jpg',
    alt: 'Crystal texture',
    crystalPosition: 'default' as const
  },
  {
    src: '/textures/presets/glass.jpg',
    alt: 'Glass texture',
    crystalPosition: 'top-right' as const
  },
  {
    src: '/textures/presets/gold.jpg',
    alt: 'Gold texture',
    crystalPosition: 'bottom-left' as const
  },
  {
    src: '/textures/presets/holographic.jpg',
    alt: 'Holographic texture',
    crystalPosition: 'center' as const
  }
];

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage crystalParams={defaultModelParams} galleryImages={mockGalleryImages} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notes" 
          element={
            <ProtectedRoute>
              <NotesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Toaster richColors position="top-right" />
    </Router>
  );
}

export default App;
