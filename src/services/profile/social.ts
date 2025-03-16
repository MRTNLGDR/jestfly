
// Import services
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Segue um usuário
 */
export const followUser = async (userId: string, targetUserId: string) => {
  try {
    // Verificar se já está seguindo
    const { data: existingFollow } = await supabase
      .from('user_follows')
      .select('id')
      .eq('follower_id', userId)
      .eq('following_id', targetUserId)
      .maybeSingle();
      
    if (existingFollow) {
      return { success: true, alreadyFollowing: true };
    }
    
    // Seguir usuário via insert diretamente
    const { error } = await supabase
      .from('user_follows')
      .insert({
        follower_id: userId,
        following_id: targetUserId,
        created_at: new Date().toISOString()
      });
      
    if (error) {
      console.error('Erro ao seguir usuário:', error);
      throw error;
    }
    
    return { success: true, alreadyFollowing: false };
  } catch (err) {
    console.error('Erro ao seguir usuário:', err);
    toast.error('Erro ao seguir usuário');
    throw err;
  }
};

/**
 * Deixa de seguir um usuário
 */
export const unfollowUser = async (userId: string, targetUserId: string) => {
  try {
    // Deixar de seguir via delete direto
    const { error } = await supabase
      .from('user_follows')
      .delete()
      .eq('follower_id', userId)
      .eq('following_id', targetUserId);
      
    if (error) {
      console.error('Erro ao deixar de seguir usuário:', error);
      throw error;
    }
    
    return { success: true };
  } catch (err) {
    console.error('Erro ao deixar de seguir usuário:', err);
    toast.error('Erro ao deixar de seguir usuário');
    throw err;
  }
};

/**
 * Verifica se um usuário está seguindo outro
 */
export const checkIfFollowing = async (userId: string, targetUserId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_follows')
      .select('id')
      .eq('follower_id', userId)
      .eq('following_id', targetUserId)
      .maybeSingle();
      
    if (error) {
      console.error('Erro ao verificar se está seguindo:', error);
      throw error;
    }
    
    return !!data;
  } catch (err) {
    console.error('Erro ao verificar se está seguindo:', err);
    return false;
  }
};

/**
 * Busca seguidores de um usuário
 */
export const fetchFollowers = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_follows')
      .select('follower_id')
      .eq('following_id', userId);
      
    if (error) {
      console.error('Erro ao buscar seguidores:', error);
      throw error;
    }
    
    return data || [];
  } catch (err) {
    console.error('Erro ao buscar seguidores:', err);
    throw err;
  }
};

/**
 * Busca usuários que um usuário segue
 */
export const fetchFollowing = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_follows')
      .select('following_id')
      .eq('follower_id', userId);
      
    if (error) {
      console.error('Erro ao buscar seguindo:', error);
      throw error;
    }
    
    return data || [];
  } catch (err) {
    console.error('Erro ao buscar seguindo:', err);
    throw err;
  }
};
