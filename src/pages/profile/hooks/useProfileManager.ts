
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '../../../models/User';
import { fetchUserProfile } from '../../../services/profileService';

export const useProfileManager = (
  userId?: string,
  currentUser?: User | null,
  refreshUserData?: () => Promise<void>
) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Se não houver userId no parâmetro, use o ID do usuário atual
      const targetUserId = userId || currentUser?.id;
      
      if (!targetUserId) {
        setError('Usuário não encontrado');
        setIsLoading(false);
        return;
      }
      
      // Implementar timeout para evitar espera infinita
      const fetchPromise = fetchUserProfile(targetUserId);
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error("Tempo limite excedido ao carregar perfil")), 10000);
      });
      
      // Race entre busca e timeout
      const profileData = await Promise.race([fetchPromise, timeoutPromise])
        .catch(error => {
          return null;
        });
      
      if (!profileData) {
        setError('Erro ao buscar dados do usuário. Tente novamente mais tarde.');
        setIsLoading(false);
        return;
      }
      
      setProfile(profileData);
      
      // Verificar se este é o perfil do usuário atual
      setIsCurrentUser(
        !!(currentUser && currentUser.id === profileData.id)
      );
    } catch (error: any) {
      setError(`Erro ao buscar dados do usuário: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (refreshUserData) {
      refreshUserData().then(() => {
        loadProfile();
      });
    } else {
      loadProfile();
    }
  };

  // Carregar perfil na montagem
  useEffect(() => {
    if (currentUser || userId) {
      loadProfile();
    } else {
      setIsLoading(false);
      setError('Faça login para ver seu perfil');
    }
  }, [userId, currentUser]);

  return {
    profile,
    isLoading,
    error,
    isCurrentUser,
    loadProfile,
    handleRefresh
  };
};
