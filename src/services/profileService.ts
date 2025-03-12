
import { supabase } from '../integrations/supabase/client';
import { UserProfile, Post, UserFollow } from '../models/Post';

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id, 
      username, 
      display_name, 
      bio, 
      avatar, 
      cover_image, 
      website, 
      social_links, 
      created_at, 
      profile_type,
      is_verified
    `)
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }

  // Como não temos a tabela user_follows ainda, estamos definindo valores de exemplo
  const followersCount = 0;
  const followingCount = 0;

  return {
    ...data,
    followers_count: followersCount,
    following_count: followingCount,
  } as UserProfile;
};

export const fetchUserPosts = async (userId: string): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('community_posts')
    .select(`
      id,
      title,
      content,
      category,
      user_id,
      created_at,
      updated_at,
      likes_count,
      comments_count,
      is_featured,
      is_pinned
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar posts do usuário:', error);
    return [];
  }

  // Buscar informações do autor para cada post
  const authorProfile = await fetchUserProfile(userId);
  
  return data.map(post => ({
    ...post,
    author: authorProfile ? {
      username: authorProfile.username,
      displayName: authorProfile.display_name,
      avatar: authorProfile.avatar
    } : undefined
  }));
};

// Esta é uma implementação temporária até criarmos a tabela user_follows
export const followUser = async (
  followingId: string,
  currentUserId: string
): Promise<boolean> => {
  console.log(`Simulando seguir usuário: ${currentUserId} seguindo ${followingId}`);
  // Retornando true para simular que agora está seguindo
  return true;
};

// Esta é uma implementação temporária até criarmos a tabela user_follows
export const checkIfFollowing = async (
  followingId: string,
  currentUserId: string
): Promise<boolean> => {
  console.log(`Simulando verificação de seguidor: ${currentUserId} segue ${followingId}?`);
  // Retornando false para simular que não está seguindo ainda
  return false;
};
