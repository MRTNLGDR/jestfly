
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AvatarUpload from './AvatarUpload';

interface ProfileTabProps {
  profileData: {
    display_name: string;
    username: string;
    bio: string;
  };
  setProfileData: React.Dispatch<React.SetStateAction<{
    display_name: string;
    username: string;
    bio: string;
  }>>;
  handleProfileUpdate: (e: React.FormEvent) => Promise<void>;
  updating: boolean;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ 
  profileData, 
  setProfileData, 
  handleProfileUpdate, 
  updating 
}) => {
  return (
    <GlassCard>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Informações de Perfil</h2>
        
        <div className="flex flex-col md:flex-row gap-8 mb-6">
          <AvatarUpload />
          
          <form onSubmit={handleProfileUpdate} className="space-y-4 flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="display_name" className="text-white">Nome de Exibição</Label>
                <Input
                  id="display_name"
                  value={profileData.display_name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, display_name: e.target.value }))}
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Nome de Usuário</Label>
                <Input
                  id="username"
                  value={profileData.username}
                  onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white">Biografia</Label>
              <textarea
                id="bio"
                value={profileData.bio || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="w-full rounded bg-black/20 border border-white/10 p-2 text-white"
              />
            </div>
            
            <div className="pt-4">
              <Button type="submit" disabled={updating} className="bg-purple-600 hover:bg-purple-700">
                {updating ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </GlassCard>
  );
};

export default ProfileTab;
