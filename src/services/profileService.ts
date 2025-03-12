
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

  // Buscar contagem de seguidores
  const { count: followersCount, error: followersError } = await supabase
    .from('user_follows')
    .select('id', { count: 'exact', head: true })
    .eq('following_id', userId);

  // Buscar contagem de seguindo
  const { count: followingCount, error: followingError } = await supabase
    .from('user_follows')
    .select('id', { count: 'exact', head: true })
    .eq('follower_id', userId);

  return {
    ...data,
    followers_count: followersCount || 0,
    following_count: followingCount || 0,
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

export const followUser = async (
  followingId: string,
  currentUserId: string
): Promise<boolean> => {
  // Verificar se já segue o usuário
  const { data: existingFollow, error: checkError } = await supabase
    .from('user_follows')
    .select('id')
    .eq('follower_id', currentUserId)
    .eq('following_id', followingId)
    .maybeSingle();

  if (checkError) {
    console.error('Erro ao verificar seguidor:', checkError);
    return false;
  }

  // Se já segue, remover o follow (unfollow)
  if (existingFollow) {
    const { error: deleteError } = await supabase
      .from('user_follows')
      .delete()
      .eq('id', existingFollow.id);

    if (deleteError) {
      console.error('Erro ao deixar de seguir:', deleteError);
      return false;
    }
    return false; // Retorna falso indicando que não está mais seguindo
  }

  // Se não segue, adicionar novo follow
  const { error: insertError } = await supabase
    .from('user_follows')
    .insert({
      follower_id: currentUserId,
      following_id: followingId,
    });

  if (insertError) {
    console.error('Erro ao seguir usuário:', insertError);
    return false;
  }

  return true; // Retorna verdadeiro indicando que agora está seguindo
};

export const checkIfFollowing = async (
  followingId: string,
  currentUserId: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('user_follows')
    .select('id')
    .eq('follower_id', currentUserId)
    .eq('following_id', followingId)
    .maybeSingle();

  if (error) {
    console.error('Erro ao verificar se segue usuário:', error);
    return false;
  }

  return !!data;
};
