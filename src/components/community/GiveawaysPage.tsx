
import React from 'react';
import CommunityNav from './CommunityNav';
import GlassHeader from '@/components/GlassHeader';

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Comunidade", href: "/community" },
  { label: "Loja", href: "/store" },
  { label: "Bookings", href: "/bookings" },
  { label: "Demo", href: "/submit-demo" },
  { label: "Transmissão", href: "/live" },
  { label: "Press Kit", href: "/press-kit" },
  { label: "Airdrop", href: "/airdrop" }
];

const GiveawaysPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950">
      <GlassHeader menuItems={menuItems} />
      
      <div className="pt-16">
        <CommunityNav />
        
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-8">
            Sorteios JESTFLY
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-black/40 backdrop-blur-md border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-2">Próximos sorteios</h3>
              <p className="text-white/70">
                Em breve anunciaremos sorteios exclusivos para a comunidade JESTFLY.
                Fique de olho para não perder nenhuma oportunidade!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiveawaysPage;
