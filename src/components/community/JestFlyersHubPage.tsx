
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

const JestFlyersHubPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950">
      <GlassHeader menuItems={menuItems} />
      
      <div className="pt-16">
        <CommunityNav />
        
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-8">
            JestFlyers Hub
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/40 backdrop-blur-md border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">O que é o JestFlyers Hub?</h3>
              <p className="text-white/70 mb-4">
                O JestFlyers Hub é o centro da comunidade mais dedicada de fãs da JESTFLY. 
                Aqui você encontra conteúdo exclusivo, interações especiais com artistas e muito mais.
              </p>
              <p className="text-white/70">
                Junte-se a nós e faça parte deste movimento único na cena musical.
              </p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Benefícios dos JestFlyers</h3>
              <ul className="list-disc list-inside text-white/70 space-y-2">
                <li>Acesso antecipado a lançamentos</li>
                <li>Encontros exclusivos com artistas</li>
                <li>Descontos em produtos da loja</li>
                <li>Acesso a áreas VIP em eventos</li>
                <li>Perfil verificado na comunidade</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JestFlyersHubPage;
