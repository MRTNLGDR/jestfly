
import { supabase } from '../../integrations/supabase/client';
import { Post } from '../../models/Post';

/**
 * Verifica se um usuário está seguindo outro
 */
export const checkIfFollowing = async (userId: string, targetUserId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_follows')
      .select('*')
      .match({
        follower_id: userId,
        following_id: targetUserId
      })
      .maybeSingle();
    
    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error("Erro ao verificar se segue usuário:", error);
    return false;
  }
};

/**
 * Segue um usuário
 */
export const followUser = async (userId: string, targetUserId: string): Promise<boolean> => {
  try {
    // Check if already following
    const isAlreadyFollowing = await checkIfFollowing(userId, targetUserId);
    
    if (isAlreadyFollowing) {
      return true; // Already following
    }
    
    // Insert follow relationship
    const { error } = await supabase
      .from('user_follows')
      .insert({
        follower_id: userId,
        following_id: targetUserId
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Erro ao seguir usuário:", error);
    return false;
  }
};

/**
 * Deixa de seguir um usuário
 */
export const unfollowUser = async (userId: string, targetUserId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_follows')
      .delete()
      .match({
        follower_id: userId,
        following_id: targetUserId
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Erro ao deixar de seguir usuário:", error);
    return false;
  }
};

/**
 * Busca os posts de um usuário
 */
export const fetchUserPosts = async (userId: string): Promise<Post[]> => {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*, profiles:profiles(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as unknown as Post[] || [];
  } catch (error) {
    console.error("Erro ao buscar posts do usuário:", error);
    return [];
  }
};
