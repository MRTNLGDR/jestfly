
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LogsPage from '@/pages/LogsPage';
import HomePage from '@/pages/HomePage';
import { useAuth } from '@/contexts/AuthContext';

function App() {
  const { profile } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-purple-900">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/system/logs" element={<LogsPage />} />
        {/* Adicionar outras rotas aqui conforme necessário */}
      </Routes>
    </div>
  );
}

export default App;
