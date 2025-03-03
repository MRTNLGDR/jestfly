
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProfileSettingsProps {
  profileData: any;
  editForm: {
    display_name: string;
    username: string;
    bio: string;
    location: string;
    website: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleProfileUpdate: (e: React.FormEvent) => Promise<void>;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profileData,
  editForm,
  handleInputChange,
  handleProfileUpdate
}) => {
  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-white mb-6">Configurações do Perfil</h2>
      <form onSubmit={handleProfileUpdate}>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 overflow-hidden">
              <img src={profileData.avatar || '/assets/imagem1.jpg'} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-white mb-3">Foto de Perfil</h3>
              <div className="flex gap-3">
                <button type="button" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                  Enviar Imagem
                </button>
                <button type="button" className="bg-red-900/20 hover:bg-red-900/30 text-red-400 px-4 py-2 rounded-lg transition-colors">
                  Remover
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-white/80 mb-2">Nome de Exibição</label>
            <input
              type="text"
              name="display_name"
              value={editForm.display_name}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-white/80 mb-2">Nome de Usuário</label>
            <input
              type="text"
              name="username"
              value={editForm.username}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-white/80 mb-2">Bio</label>
            <textarea
              name="bio"
              value={editForm.bio}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
              rows={4}
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/80 mb-2">Localização</label>
              <input
                type="text"
                name="location"
                value={editForm.location}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-2">Website</label>
              <input
                type="text"
                name="website"
                value={editForm.website}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-medium text-white mb-4">Configurações da Conta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 mb-2">Endereço de Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white/50"
                />
                <p className="text-white/60 text-xs mt-1">Entre em contato com o suporte para alterar seu email</p>
              </div>
              <div>
                <label className="block text-white/80 mb-2">Senha</label>
                <button type="button" className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors">
                  Alterar Senha
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-medium text-white mb-4">Preferências de Notificação</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input type="checkbox" id="emailNotif" className="mr-3" defaultChecked />
                <label htmlFor="emailNotif" className="text-white/80">Notificações por email para eventos</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="promoNotif" className="mr-3" defaultChecked />
                <label htmlFor="promoNotif" className="text-white/80">Emails promocionais e ofertas</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="nftNotif" className="mr-3" defaultChecked />
                <label htmlFor="nftNotif" className="text-white/80">Notificações de novos lançamentos de NFT</label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between border-t border-white/10 pt-6">
            <button
              type="button"
              className="bg-red-900/20 hover:bg-red-900/30 text-red-400 px-6 py-3 rounded-lg transition-colors"
            >
              Excluir Conta
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
