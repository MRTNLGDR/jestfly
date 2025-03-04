
import React from 'react';

const BookingLoginRequired: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white">Sistema de Reservas</h1>
      <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Login Necessário</h2>
        <p className="text-white/70 mb-6">
          Para realizar reservas, é necessário estar logado no sistema.
        </p>
        <a 
          href="/auth" 
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
        >
          Faça Login
        </a>
      </div>
    </div>
  );
};

export default BookingLoginRequired;
