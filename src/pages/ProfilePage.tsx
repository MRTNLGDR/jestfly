
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../services/profileService';
import { UserProfile } from '../models/User';
import { useAuth } from '../contexts/auth';
import { toast } from 'sonner';
import LoadingState from './profile/LoadingState';
import ErrorState from './profile/ErrorState';
import NotFoundState from './profile/NotFoundState';
import ProfileDisplay from './profile/ProfileDisplay';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { currentUser } = useAuth();
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
      
      // Implementar timeout para evitar espera infinita
      const fetchPromise = fetchUserProfile(targetUserId);
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error("Tempo limite excedido ao carregar perfil")), 10000);
      });
      
      // Race between fetch and timeout
      const profileData = await Promise.race([fetchPromise, timeoutPromise])
        .catch(error => {
          console.error("Profile fetch timeout:", error);
          return null;
        });
      
      console.log("Profile data received:", profileData);
      
      if (!profileData) {
        console.log("No profile data found");
        setError('Perfil não encontrado ou tempo limite excedido');
        setIsLoading(false);
        return;
      }
      
      setProfile(profileData);
      
      // Check if this is the current user's profile
      setIsCurrentUser(
        !!(currentUser && currentUser.id === profileData.id)
      );
    } catch (error: any) {
      console.error('Erro ao carregar perfil:', error);
      setError(`Erro ao carregar perfil: ${error.message}`);
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
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error, loadAttempts]);

  const handleRefresh = () => {
    loadProfile();
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState 
        error={error}
        userId={userId}
        currentUserId={currentUser?.id}
        onRefresh={handleRefresh}
        onBack={handleBack}
      />
    );
  }

  if (!profile) {
    return (
      <NotFoundState
        userId={userId}
        currentUserId={currentUser?.id}
        onRefresh={handleRefresh}
        onBack={handleBack}
      />
    );
  }

  return (
    <ProfileDisplay
      profile={profile}
      isCurrentUser={isCurrentUser}
      onBack={handleBack}
    />
  );
};

export default ProfilePage;
