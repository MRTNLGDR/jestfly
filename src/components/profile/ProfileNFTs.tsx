
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProfileNFTsProps {
  profileData: any;
}

const ProfileNFTs: React.FC<ProfileNFTsProps> = ({ profileData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Sua Coleção NFT</h2>
          <div className="flex gap-2">
            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
              Ver Loja
            </button>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Conectar Carteira
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholders para NFTs bloqueadas */}
          {[1, 2, 3, 4, 5, 6].map(item => (
            <div key={`placeholder-${item}`} className="bg-white/5 rounded-lg overflow-hidden opacity-30 hover:opacity-40 transition-opacity">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <span className="text-6xl">?</span>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-medium text-white">NFT Bloqueada #{item}</h3>
                <div className="flex justify-between items-center mt-3">
                  <div>
                    <p className="text-xs text-white/60">Status</p>
                    <p className="text-white/90">Bloqueada</p>
                  </div>
                  <button className="bg-white/20 text-white px-3 py-1 rounded-full text-xs">
                    Desbloquear
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Conquistas NFT</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-2xl">
                🏆
              </div>
              <div>
                <h3 className="text-white font-medium">Colecionador</h3>
                <p className="text-white/70 text-sm">Colecione 5 NFTs</p>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>0/5</span>
              <span>Em progresso</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-700/40 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-500 rounded-full flex items-center justify-center text-2xl">
                🛒
              </div>
              <div>
                <h3 className="text-white font-medium">Primeira Compra</h3>
                <p className="text-white/70 text-sm">Compre seu primeiro NFT</p>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="bg-gradient-to-r from-gray-500 to-gray-400 h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>0/1</span>
              <span>Não completado</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-700/40 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-500 rounded-full flex items-center justify-center text-2xl">
                🔥
              </div>
              <div>
                <h3 className="text-white font-medium">Raridade</h3>
                <p className="text-white/70 text-sm">Colecione um NFT raro</p>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="bg-gradient-to-r from-gray-500 to-gray-400 h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>0/1</span>
              <span>Não completado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileNFTs;
