
import { UserProfile } from '../../models/User';
import { toast } from 'sonner';
import { 
  fetchBasicProfile, 
  fetchFollowCounts, 
  mapToUserProfile, 
  createEmptyProfile,
  updateProfile as updateProfileCore
} from './core';
import { supabase } from '../../integrations/supabase/client';

/**
 * Busca o perfil completo de um usuário
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    console.log(`Iniciando busca de perfil para usuário: ${userId}`);
    const startTime = Date.now();
    
    // Buscar dados básicos do perfil
    let profileData = await fetchBasicProfile(userId);
    
    if (!profileData) {
      console.warn(`Nenhum perfil encontrado para o usuário: ${userId}`);
      
      // Tente criar um perfil vazio para correção automática
      const { error: sessionError, data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionError && sessionData.session?.user) {
        const user = sessionData.session.user;
        const success = await createEmptyProfile(userId, user);
              
        if (success) {
          toast.success("Perfil recuperado com sucesso!");
          console.log("Perfil recuperado após criar automaticamente");
          
          // Tente buscar o perfil novamente
          profileData = await fetchBasicProfile(userId);
          
          if (!profileData) {
            return null; // Ainda não conseguimos encontrar mesmo após criar
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
    
    // Buscar contagens de seguidores e seguindo
    const { followersCount, followingCount } = await fetchFollowCounts(userId);
    
    // Converter para o formato UserProfile
    const userProfile = mapToUserProfile(profileData, followersCount, followingCount);
    
    console.log(`Perfil completo carregado: ${userProfile.display_name}`);
    return userProfile;
  } catch (error: any) {
    console.error(`Erro ao buscar perfil do usuário: ${error.message}`, error);
    throw error;
  }
};

/**
 * Atualiza o perfil de um usuário
 */
export const updateUserProfile = updateProfileCore;

// Exportar funções sociais para manter compatibilidade
export { 
  followUser,
  unfollowUser,
  checkIfFollowing,
  fetchUserPosts
} from './social';
