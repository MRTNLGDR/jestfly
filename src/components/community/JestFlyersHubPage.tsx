
import React from 'react';
import { Users, Check, Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JestFlyersHubPage: React.FC = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-8">
        JestFlyers Hub
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-black/40 backdrop-blur-md border border-purple-500/20 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-6 w-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">O que é o JestFlyers Hub?</h3>
          </div>
          <p className="text-white/70 mb-4">
            O JestFlyers Hub é o centro da comunidade mais dedicada de fãs da JESTFLY. 
            Aqui você encontra conteúdo exclusivo, interações especiais com artistas e muito mais.
          </p>
          <p className="text-white/70">
            Junte-se a nós e faça parte deste movimento único na cena musical.
          </p>
          
          <Button className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            Tornar-se um JestFlyer
          </Button>
        </div>
        
        <div className="bg-black/40 backdrop-blur-md border border-purple-500/20 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Star className="h-6 w-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Benefícios dos JestFlyers</h3>
          </div>
          <ul className="space-y-3 text-white/70">
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Acesso antecipado a lançamentos</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Encontros exclusivos com artistas</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Descontos em produtos da loja</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Acesso a áreas VIP em eventos</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Perfil verificado na comunidade</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span>NFTs e tokens exclusivos</span>
            </li>
          </ul>
          
          <div className="mt-6 flex items-center">
            <Award className="h-5 w-5 text-yellow-400 mr-2" />
            <span className="text-sm text-yellow-400 font-medium">50 JestCoins ao se tornar membro</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default JestFlyersHubPage;
