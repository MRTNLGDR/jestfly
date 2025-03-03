
import React from 'react';
import { Gift, ArrowRight } from 'lucide-react';

const GiveawaysPage: React.FC = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-8">
        Sorteios JESTFLY
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-black/40 backdrop-blur-md border border-purple-500/20 rounded-lg p-6 transition-all hover:border-purple-500/40 hover:transform hover:translate-y-[-5px]">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="h-5 w-5 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Próximos sorteios</h3>
          </div>
          <p className="text-white/70 mb-4">
            Em breve anunciaremos sorteios exclusivos para a comunidade JESTFLY.
            Fique de olho para não perder nenhuma oportunidade!
          </p>
          <div className="flex items-center text-purple-400 text-sm font-medium mt-2 group cursor-pointer">
            <span>Notificar-me</span>
            <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-md border border-purple-500/20 rounded-lg p-6 transition-all hover:border-purple-500/40 hover:transform hover:translate-y-[-5px]">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="h-5 w-5 text-purple-400" />
            <h3 className="text-xl font-bold text-white">NFT Exclusivo</h3>
          </div>
          <p className="text-white/70 mb-4">
            Sorteio de um NFT exclusivo para membros premium da comunidade.
            Inscreva-se para concorrer a esta peça digital única.
          </p>
          <div className="flex items-center text-purple-400 text-sm font-medium mt-2 group cursor-pointer">
            <span>Em breve</span>
            <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </>
  );
};

export default GiveawaysPage;
