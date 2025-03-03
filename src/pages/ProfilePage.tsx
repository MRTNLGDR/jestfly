
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/auth';
import { User } from '../models/User';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';

const ProfilePage: React.FC = () => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<User | null>(null);

  useEffect(() => {
    if (userData) {
      setProfileData(userData);
    }
  }, [userData]);

  // Handle form submission to update user profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData || !userData) return;

    setLoading(true);
    try {
      // Code to update user profile would go here
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return <div className="flex justify-center items-center h-screen">Você precisa estar logado para acessar esta página.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Perfil do Usuário</h1>
        <p className="text-gray-400">Seja bem-vindo(a), {userData.displayName || userData.username}!</p>
      </div>

      <Card className="p-6 bg-zinc-900 border-zinc-800">
        <form onSubmit={handleUpdateProfile}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nome de exibição</label>
              <input
                type="text"
                value={profileData?.displayName || ''}
                onChange={(e) => setProfileData(prev => prev ? {...prev, displayName: e.target.value} : null)}
                className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nome de usuário</label>
              <input
                type="text"
                value={profileData?.username || ''}
                onChange={(e) => setProfileData(prev => prev ? {...prev, username: e.target.value} : null)}
                className="w-full p-3 rounded bg-zinc-800 border border-zinc-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={profileData?.email || ''}
                disabled
                className="w-full p-3 rounded bg-zinc-800/50 border border-zinc-700 opacity-70"
              />
              <p className="text-xs mt-1 text-zinc-500">O email não pode ser alterado.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de perfil</label>
              <input
                type="text"
                value={profileData?.profileType === 'fan' ? 'Fã' : 
                       profileData?.profileType === 'artist' ? 'Artista' :
                       profileData?.profileType === 'admin' ? 'Administrador' : 'Colaborador'}
                disabled
                className="w-full p-3 rounded bg-zinc-800/50 border border-zinc-700 opacity-70"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={profileData?.bio || ''}
                onChange={(e) => setProfileData(prev => prev ? {...prev, bio: e.target.value} : null)}
                className="w-full p-3 rounded bg-zinc-800 border border-zinc-700 min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-medium disabled:opacity-70"
            >
              {loading ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;
