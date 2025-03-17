
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '../../../models/User';
import { fetchUserProfile } from '../../../services/profileService';
import { toast } from 'sonner';

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
      console.log("Carregando perfil com userId:", userId, "currentUser:", currentUser?.id);
      
      // Se não houver userId no parâmetro, use o ID do usuário atual
      const targetUserId = userId || currentUser?.id;
      
      if (!targetUserId) {
        console.log("Nenhum ID de usuário alvo encontrado");
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
          console.error("Erro na busca de perfil:", error);
          return null;
        });
      
      console.log("Dados do perfil recebidos:", profileData);
      
      if (!profileData) {
        console.log("Nenhum dado de perfil encontrado");
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
      console.error('Erro ao carregar perfil:', error);
      setError(`Erro ao buscar dados do usuário: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    // Se tivermos a função de atualização do contexto de autenticação, use-a
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
      // Se não tivermos um usuário ou userId, não podemos carregar um perfil
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
