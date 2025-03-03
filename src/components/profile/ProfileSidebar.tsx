
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ProfileSidebarProps {
  profileData: any;
  activeTab: 'overview' | 'nfts' | 'settings';
  setActiveTab: (tab: 'overview' | 'nfts' | 'settings') => void;
  handleLogout: () => Promise<void>;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ 
  profileData, 
  activeTab, 
  setActiveTab,
  handleLogout 
}) => {
  return (
    <div className="w-full md:w-1/4 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6 sticky top-24">
      <div className="flex flex-col items-center mb-6">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 mb-4 overflow-hidden">
          <img 
            src={profileData.avatar || '/assets/imagem1.jpg'} 
            alt="Profile" 
            className="w-full h-full object-cover" 
          />
        </div>
        <h2 className="text-2xl font-bold text-white">{profileData.display_name}</h2>
        <p className="text-white/70 text-sm mt-1">
          Membro desde {new Date(profileData.created_at).toLocaleDateString('pt-BR')}
        </p>
        <p className="text-purple-400 text-sm mt-1">
          @{profileData.username} · {profileData.profile_type}
        </p>
      </div>
      
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-lg">
        <div className="flex justify-between mb-2">
          <span className="text-white/80">JestCoins</span>
          <span className="text-white font-bold">0</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" 
                style={{ width: `0%` }}></div>
        </div>
        <div className="flex justify-between text-xs text-white/60 mt-1">
          <span>Nível 1</span>
          <span>Nível 2 (100 JC)</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'overview' 
              ? 'bg-white/10 text-white' 
              : 'text-white/70 hover:bg-white/5'
          }`}
        >
          Visão Geral
        </button>
        <button 
          onClick={() => setActiveTab('nfts')}
          className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'nfts' 
              ? 'bg-white/10 text-white' 
              : 'text-white/70 hover:bg-white/5'
          }`}
        >
          Coleção NFT
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'settings' 
              ? 'bg-white/10 text-white' 
              : 'text-white/70 hover:bg-white/5'
          }`}
        >
          Configurações
        </button>
        <button className="w-full text-left px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 transition-colors">
          Histórico de Compras
        </button>
        <button className="w-full text-left px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 transition-colors">
          Eventos Salvos
        </button>
        <button 
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors mt-4"
        >
          Sair
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
