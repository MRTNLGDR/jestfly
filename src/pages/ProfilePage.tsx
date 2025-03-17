
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../services/profileService';
import { UserProfile } from '../types/auth';
import { useAuth } from '../contexts/auth';
import { toast } from 'sonner';
import LoadingState from './profile/LoadingState';
import ErrorState from './profile/ErrorState';
import NotFoundState from './profile/NotFoundState';
import ProfileDisplay from './profile/ProfileDisplay';
import { forceCreateProfile } from '../services/diagnostic/profileRepair';

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
      
      // Implement timeout to avoid infinite waiting
      const fetchPromise = fetchUserProfile(targetUserId);
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error("Tempo limite excedido ao carregar perfil")), 15000);
      });
      
      // Race between fetch and timeout
      const profileData = await Promise.race([fetchPromise, timeoutPromise])
        .catch(error => {
          console.error("Profile fetch timeout:", error);
          
          // Check for specific errors that require special handling
          const errorMsg = error?.message || String(error);
          
          // If error is related to infinite recursion, log for diagnostics
          if (errorMsg.includes('infinite recursion')) {
            console.error("Infinite recursion detected in profile fetch:", error);
          }
          
          // If error is related to profile not existing and it's the current user,
          // attempt to create profile automatically
          if (currentUser && targetUserId === currentUser.id) {
            toast.info("Tentando criar perfil automaticamente...");
            return forceCreateProfile(currentUser)
              .then(result => {
                if (result.success) {
                  // If profile creation succeeded, try to fetch it again
                  return fetchUserProfile(targetUserId);
                }
                return null;
              })
              .catch(() => null);
          }
          
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

  // Add retry logic if profile fails to load, with progressive backoff
  useEffect(() => {
    if (error && loadAttempts < 3 && (currentUser || userId)) {
      const backoffTime = Math.min(2000 * Math.pow(2, loadAttempts), 15000); // Exponential backoff with max 15s
      
      const timer = setTimeout(() => {
        console.log(`Automatic retry attempt ${loadAttempts + 1} to load profile (backoff: ${backoffTime}ms)`);
        setLoadAttempts(prev => prev + 1);
        loadProfile();
      }, backoffTime);
      
      return () => clearTimeout(timer);
    }
  }, [error, loadAttempts]);

  const handleRefresh = () => {
    // Clear previous errors and attempts
    setError(null);
    setLoadAttempts(0);
    
    // If we have the refresh function from auth context, use it
    if (refreshUserData) {
      refreshUserData().then(() => {
        loadProfile();
      });
    } else {
      loadProfile();
    }
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
