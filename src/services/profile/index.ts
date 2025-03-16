
import { fetchBasicProfile, updateProfile, createProfileIfNotExists } from './core';
import { followUser, unfollowUser, checkIfFollowing, fetchFollowers, fetchFollowing } from './social';
import { supabase } from '../../integrations/supabase/client';

/**
 * Busca o perfil completo do usuário, incluindo contagens de seguidores
 */
export const fetchUserProfile = async (userId: string) => {
  try {
    console.log("Iniciando busca de perfil para usuário:", userId);
    const basicProfile = await fetchBasicProfile(userId);
    
    if (!basicProfile) {
      console.log("Perfil básico não encontrado para:", userId);
      return null;
    }
    
    // Buscar contagens de seguidores e seguindo
    let followersCount = 0;
    let followingCount = 0;
    
    try {
      // Usar funções RPC para evitar problemas de recursão infinita em RLS
      const { data: followers, error: followersError } = await supabase
        .rpc('count_followers', { user_id: userId });
        
      if (followersError) {
        console.error("Erro ao buscar contagem de seguidores:", followersError);
      } else {
        followersCount = followers || 0;
      }
      
      const { data: following, error: followingError } = await supabase
        .rpc('count_following', { user_id: userId });
        
      if (followingError) {
        console.error("Erro ao buscar contagem de seguindo:", followingError);
      } else {
        followingCount = following || 0;
      }
    } catch (err) {
      console.error("Erro ao buscar contagens sociais:", err);
    }
    
    // Combinar perfil básico com dados sociais
    const completeProfile = {
      ...basicProfile,
      followers_count: followersCount,
      following_count: followingCount,
      // Garantir campos necessários com valores padrão
      social_links: basicProfile.social_links || {},
      avatar_url: basicProfile.avatar || '',
      is_verified: basicProfile.is_verified || false
    };
    
    return completeProfile;
  } catch (err) {
    console.error("Erro ao buscar perfil do usuário:", err);
    throw err;
  }
};

// Re-exportar funções
export {
  updateProfile,
  createProfileIfNotExists,
  followUser,
  unfollowUser,
  checkIfFollowing,
  fetchFollowers,
  fetchFollowing
};

/**
 * Busca posts do usuário
 */
export const fetchUserPosts = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Erro ao buscar posts do usuário:", error);
      throw error;
    }
    
    return data || [];
  } catch (err) {
    console.error("Erro ao buscar posts do usuário:", err);
    throw err;
  }
};
