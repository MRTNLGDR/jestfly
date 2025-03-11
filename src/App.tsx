
import React from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import './App.css';

// Criando um cliente QueryClient para o React Query
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="app bg-gradient-to-b from-black to-purple-900/20 min-h-screen">
          <Toaster position="top-right" />
          <Outlet />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
