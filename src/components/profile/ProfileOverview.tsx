
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProfileOverviewProps {
  profileData: any;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ profileData }) => {
  return (
    <div className="space-y-8">
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Visão Geral do Perfil</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-white/80 font-medium">Bio</h3>
            <p className="text-white mt-1">{profileData.bio || "Sem bio definida"}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-white/80 font-medium">Localização</h3>
              <p className="text-white mt-1">
                {profileData.social_links?.location || "Não informada"}
              </p>
            </div>
            <div>
              <h3 className="text-white/80 font-medium">Website</h3>
              <p className="text-white mt-1">
                {profileData.social_links?.website || "Não informado"}
              </p>
            </div>
            <div>
              <h3 className="text-white/80 font-medium">Tipo de Perfil</h3>
              <p className="text-white mt-1">{profileData.profile_type}</p>
            </div>
            <div>
              <h3 className="text-white/80 font-medium">Email</h3>
              <p className="text-white mt-1">{profileData.email}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Sua Coleção NFT</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg overflow-hidden border border-dashed border-white/30 flex flex-col items-center justify-center p-6 aspect-square">
            <span className="text-3xl mb-2">➕</span>
            <p className="text-white/70 text-center">Descubra mais NFTs na loja</p>
            <button className="mt-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
              Ver Loja
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Próximos Eventos</h2>
        <div className="bg-white/5 p-6 rounded-lg text-center">
          <p className="text-white/70">Você não tem eventos próximos.</p>
          <button className="mt-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
            Procurar Eventos
          </button>
        </div>
      </div>
      
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Compras Recentes</h2>
        <div className="bg-white/5 p-6 rounded-lg text-center">
          <p className="text-white/70">Você ainda não fez nenhuma compra.</p>
          <button className="mt-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
            Visitar Loja
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
