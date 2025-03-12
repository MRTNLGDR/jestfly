
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../services/profileService';
import { UserProfile } from '../models/Post';
import { useAuth } from '../contexts/auth';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import Footer from '../components/Footer';
import { toast } from 'sonner';
import { Undo2 } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        // Se não houver userId no parâmetro, usa o ID do usuário atual
        const targetUserId = userId || (currentUser?.id || '');
        
        if (!targetUserId) {
          toast.error('Usuário não encontrado');
          navigate('/');
          return;
        }
        
        const profileData = await fetchUserProfile(targetUserId);
        
        if (!profileData) {
          toast.error('Perfil não encontrado');
          navigate('/');
          return;
        }
        
        setProfile(profileData);
        
        // Verifica se é o perfil do usuário atual
        setIsCurrentUser(
          !!(currentUser && currentUser.id === profileData.id)
        );
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        toast.error('Erro ao carregar perfil');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [userId, currentUser, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 pt-20 flex items-center justify-center">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 pt-20 flex flex-col items-center justify-center">
        <div className="neo-blur rounded-xl border border-white/10 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Perfil não encontrado</h2>
          <p className="text-white/70 mb-6">
            O perfil que você está procurando não existe ou foi removido.
          </p>
          <button
            onClick={handleBack}
            className="flex items-center justify-center px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-md"
          >
            <Undo2 className="mr-2 h-4 w-4" />
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 pt-16">
      <button
        onClick={handleBack}
        className="absolute top-20 left-4 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
      >
        <Undo2 size={18} />
      </button>
      
      <ProfileHeader profile={profile} isCurrentUser={isCurrentUser} />
      <ProfileTabs userId={profile.id} profile={profile} />
      
      <div className="py-12"></div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
