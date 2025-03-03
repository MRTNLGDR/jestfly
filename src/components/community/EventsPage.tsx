
import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

const EventsPage: React.FC = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-8">
        Eventos da Comunidade
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-black/40 backdrop-blur-md border border-purple-500/20 rounded-lg p-6 transition-all hover:border-purple-500/40 hover:transform hover:translate-y-[-5px]">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-5 w-5 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Próximos eventos</h3>
          </div>
          <p className="text-white/70 mb-4">
            Em breve listaremos os próximos eventos da comunidade JESTFLY aqui.
            Fique ligado para participar!
          </p>
          <div className="flex items-center text-purple-400 text-sm font-medium mt-2 group cursor-pointer">
            <span>Saiba mais</span>
            <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-md border border-purple-500/20 rounded-lg p-6 transition-all hover:border-purple-500/40 hover:transform hover:translate-y-[-5px]">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-5 w-5 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Festival JESTFLY</h3>
          </div>
          <p className="text-white/70 mb-4">
            Planejamento em andamento para o primeiro festival presencial da comunidade.
            Vote nos seus artistas favoritos!
          </p>
          <div className="flex items-center text-purple-400 text-sm font-medium mt-2 group cursor-pointer">
            <span>Mais informações</span>
            <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsPage;
