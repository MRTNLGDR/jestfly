
import { supabase } from '../../integrations/supabase/client';
import { UserProfile } from '../../models/User';
import { ProfileType } from '../../integrations/supabase/schema';
import { toast } from 'sonner';

/**
 * Busca o perfil básico de um usuário do Supabase
 */
export const fetchBasicProfile = async (userId: string) => {
  console.log(`Buscando perfil básico para usuário: ${userId}`);
  const startTime = Date.now();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  console.log(`Tempo para buscar perfil básico: ${Date.now() - startTime}ms`);
  
  if (error) {
    console.error(`Erro ao buscar perfil: ${error.message}`, error);
    
    // Se for um erro de RLS, mostre uma mensagem mais amigável
    if (error.message.includes('policy') || error.message.includes('permission')) {
      toast.error("Erro de permissão ao buscar perfil. Tente fazer login novamente.");
    }
    
    throw error;
  }
  
  return data;
};

/**
 * Busca as contagens de seguidores e seguindo para um usuário
 */
export const fetchFollowCounts = async (userId: string): Promise<{followersCount: number, followingCount: number}> => {
  console.log(`Buscando contagens para usuário: ${userId}`);
  const followersStartTime = Date.now();
  
  // Fazer ambas as chamadas em paralelo
  const [followersResult, followingResult] = await Promise.all([
    supabase.rpc('count_followers', { user_id: userId }),
    supabase.rpc('count_following', { user_id: userId })
  ]);
  
  console.log(`Tempo para buscar contagens: ${Date.now() - followersStartTime}ms`);
  
  const followersCount = followersResult.data || 0;
  const followingCount = followingResult.data || 0;
  
  if (followersResult.error) {
    console.error('Erro ao buscar seguidores:', followersResult.error);
  }
  
  if (followingResult.error) {
    console.error('Erro ao buscar seguindo:', followingResult.error);
  }
  
  return { followersCount, followingCount };
};

/**
 * Atualiza o perfil de um usuário
 */
export const updateProfile = async (
  userId: string, 
  data: Partial<UserProfile>
): Promise<UserProfile | null> => {
  try {
    const { data: updatedData, error } = await supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select('*')
      .single();
    
    if (error) throw error;
    
    if (updatedData) {
      return await fetchUserProfile(userId);
    }
    
    return null;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return null;
  }
};

/**
 * Converte os dados do banco de dados para o formato UserProfile
 */
export const mapToUserProfile = (
  data: any, 
  followersCount: number = 0, 
  followingCount: number = 0
): UserProfile => {
  // Cast safely to ensure correct types
  const profileType = data.profile_type as ProfileType || 'fan';
  
  // Ensure social_links and preferences are properly typed
  const socialLinks = typeof data.social_links === 'object' && data.social_links !== null 
    ? data.social_links 
    : {};
    
  const preferences = typeof data.preferences === 'object' && data.preferences !== null 
    ? data.preferences 
    : {
        email_notifications: true,
        push_notifications: true,
        theme: 'dark' as 'dark' | 'light' | 'system',
        language: 'pt'
      };
  
  // Convertendo para o formato esperado por UserProfile
  return {
    id: data.id,
    email: data.email || '',
    display_name: data.display_name || '',
    username: data.username || '',
    avatar_url: data.avatar || '', // Map the database 'avatar' field to the expected 'avatar_url'
    bio: data.bio || '',
    followers_count: followersCount || 0,
    following_count: followingCount || 0,
    profile_type: profileType,
    is_verified: Boolean(data.is_verified),
    social_links: socialLinks as UserProfile['social_links'],
    preferences: preferences as UserProfile['preferences'],
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    last_login: data.last_login || new Date().toISOString()
  };
};

/**
 * Cria um perfil vazio para um usuário
 */
export const createEmptyProfile = async (userId: string, user: any): Promise<boolean> => {
  const userMetadata = user.user_metadata || {};
  
  try {
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: user.email,
        display_name: userMetadata.display_name || userMetadata.name || user.email?.split('@')[0] || 'User',
        username: userMetadata.username || user.email?.split('@')[0] || `user_${Date.now()}`,
        profile_type: userMetadata.profile_type || 'fan',
        avatar: userMetadata.avatar_url || null,
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      });
      
    if (!insertError) {
      console.log("Perfil criado automaticamente.");
      return true;
    } else {
      console.error("Erro ao criar perfil automaticamente:", insertError);
      return false;
    }
  } catch (e) {
    console.error("Erro ao tentar criar perfil automaticamente:", e);
    return false;
  }
};

// Re-export da função principal para manter compatibilidade
export { fetchUserProfile } from './index';
