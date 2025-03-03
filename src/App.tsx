
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

// Temporary mock data for HomePage
const mockCrystalParams = {
  color: '#4a00e0',
  size: 1.5,
  rotation: 0.01,
  roughness: 0.2,
  metalness: 0.8,
  environment: 'studio',
};

const mockGalleryImages = [
  '/textures/presets/crystal.jpg',
  '/textures/presets/glass.jpg',
  '/textures/presets/gold.jpg',
  '/textures/presets/holographic.jpg',
];

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage crystalParams={mockCrystalParams} galleryImages={mockGalleryImages} />} />
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
