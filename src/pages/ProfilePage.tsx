
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../services/profileService';
import { UserProfile } from '../models/User';
import { useAuth } from '../contexts/auth';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import ProfileDiagnostic from '../components/profile/ProfileDiagnostic';
import Footer from '../components/Footer';
import { toast } from 'sonner';
import { Undo2, RefreshCw } from 'lucide-react';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { Button } from '../components/ui/button';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { currentUser, refreshUserData } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Loading profile with userId:", userId, "currentUser:", currentUser?.id);
      
      // If there's no userId in the parameter, use the current user's ID
      const targetUserId = userId || currentUser?.id;
      
      if (!targetUserId) {
        console.log("No target user ID found");
        setError('Usuário não encontrado');
        setIsLoading(false);
        return;
      }
      
      const profileData = await fetchUserProfile(targetUserId);
      console.log("Profile data received:", profileData);
      
      if (!profileData) {
        console.log("No profile data found");
        setError('Perfil não encontrado');
        setIsLoading(false);
        return;
      }
      
      setProfile(profileData);
      
      // Check if this is the current user's profile
      setIsCurrentUser(
        !!(currentUser && currentUser.id === profileData.id)
      );
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setError('Erro ao carregar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser || userId) {
      loadProfile();
    } else {
      // If we don't have a user or userId, we can't load a profile
      setIsLoading(false);
      setError('Faça login para ver seu perfil');
    }
  }, [userId, currentUser, navigate]);

  // Add retry logic if profile fails to load
  useEffect(() => {
    if (error && loadAttempts < 2 && (currentUser || userId)) {
      const timer = setTimeout(() => {
        console.log(`Automatic retry attempt ${loadAttempts + 1} to load profile`);
        setLoadAttempts(prev => prev + 1);
        loadProfile();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [error, loadAttempts]);

  const handleRefresh = async () => {
    if (refreshUserData) {
      await refreshUserData();
    }
    loadProfile();
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 pt-20 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 pt-20 flex flex-col items-center justify-center">
        <div className="neo-blur rounded-xl border border-white/10 p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-3">Erro</h2>
          <p className="text-white/70 mb-6">{error}</p>
          
          {currentUser && (
            <>
              <ProfileDiagnostic userId={userId || currentUser.id} onRefresh={loadProfile} />
              
              <Button
                onClick={handleRefresh}
                className="flex items-center justify-center px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-md mr-2 mb-4 w-full"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar Novamente
              </Button>
            </>
          )}
          
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex items-center justify-center w-full"
          >
            <Undo2 className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 pt-20 flex flex-col items-center justify-center">
        <div className="neo-blur rounded-xl border border-white/10 p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-3">Perfil não encontrado</h2>
          <p className="text-white/70 mb-6">
            O perfil que você está procurando não existe ou foi removido.
          </p>
          
          {currentUser && (
            <ProfileDiagnostic userId={userId || currentUser.id} onRefresh={loadProfile} />
          )}
          
          <Button
            onClick={handleBack}
            className="flex items-center justify-center w-full"
            variant="outline"
          >
            <Undo2 className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 pt-16">
      <Button
        onClick={handleBack}
        className="absolute top-20 left-4 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
      >
        <Undo2 size={18} />
      </Button>
      
      <ProfileHeader profile={profile} isCurrentUser={isCurrentUser} />
      <ProfileTabs userId={profile.id} profile={profile} />
      
      <div className="py-12"></div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
