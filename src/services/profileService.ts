
import { supabase } from '../integrations/supabase/client';
import { UserProfile, UserFollow } from '../models/User';
import { Post } from '../models/Post';

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
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

    // Buscar contagens de seguidores e seguindo
    const { count: followersCount, error: followersError } = await supabase
      .from('user_follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', userId);

    const { count: followingCount, error: followingError } = await supabase
      .from('user_follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', userId);

    if (followersError) console.error('Erro ao buscar seguidores:', followersError);
    if (followingError) console.error('Erro ao buscar seguindo:', followingError);

    return {
      ...data,
      followers_count: followersCount || 0,
      following_count: followingCount || 0,
    } as UserProfile;
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    return null;
  }
};

export const fetchUserPosts = async (userId: string): Promise<Post[]> => {
  try {
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
  } catch (error) {
    console.error('Erro ao buscar posts do usuário:', error);
    return [];
  }
};

export const followUser = async (
  followingId: string,
  currentUserId: string
): Promise<boolean> => {
  try {
    // Verificar se já está seguindo
    const { data: existingFollow, error: checkError } = await supabase
      .from('user_follows')
      .select('id')
      .eq('follower_id', currentUserId)
      .eq('following_id', followingId)
      .maybeSingle();

    if (checkError) {
      console.error('Erro ao verificar se já está seguindo:', checkError);
      return false;
    }

    // Se já estiver seguindo, retorna true sem fazer nada
    if (existingFollow) {
      return true;
    }

    // Adicionar uma nova relação de seguidor
    const { error } = await supabase
      .from('user_follows')
      .insert({
        follower_id: currentUserId,
        following_id: followingId
      });

    if (error) {
      console.error('Erro ao seguir usuário:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao seguir usuário:', error);
    return false;
  }
};

export const checkIfFollowing = async (
  followingId: string,
  currentUserId: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_follows')
      .select('id')
      .eq('follower_id', currentUserId)
      .eq('following_id', followingId)
      .maybeSingle();

    if (error) {
      console.error('Erro ao verificar se está seguindo:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Erro ao verificar se está seguindo:', error);
    return false;
  }
};
