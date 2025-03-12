
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

    // Buscar contagens de seguidores e seguindo usando SQL diretamente
    // para evitar problemas com a tabela não estar no supatype
    const { count: followersCount, error: followersError } = await supabase
      .rpc('count_followers', { user_id: userId });

    const { count: followingCount, error: followingError } = await supabase
      .rpc('count_following', { user_id: userId });

    if (followersError) {
      console.error('Erro ao buscar seguidores:', followersError);
    }
    
    if (followingError) {
      console.error('Erro ao buscar seguindo:', followingError);
    }

    return {
      ...data,
      followers_count: followersCount || 0,
      following_count: followingCount || 0,
      // Fornecer valores padrão para campos obrigatórios que podem estar ausentes
      is_verified: data.is_verified || false,
      email: '', // Será preenchido em outro lugar
      preferences: {
        email_notifications: true,
        push_notifications: true,
        theme: 'dark',
        language: 'pt'
      }
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
    // Verificar se já está seguindo usando a RPC
    const { data: isFollowing, error: checkError } = await supabase
      .rpc('is_following', { 
        follower: currentUserId, 
        following: followingId 
      });

    if (checkError) {
      console.error('Erro ao verificar status de seguidor:', checkError);
      return false;
    }

    // Se já estiver seguindo, remover o follow
    if (isFollowing) {
      const { error: deleteError } = await supabase.rpc('unfollow_user', {
        follower: currentUserId,
        following: followingId
      });

      if (deleteError) {
        console.error('Erro ao deixar de seguir:', deleteError);
        return true; // Mantém como seguindo já que a operação falhou
      }
      
      return false; // Não está mais seguindo
    } 
    // Se não estiver seguindo, adicionar o follow
    else {
      const { error: insertError } = await supabase.rpc('follow_user', {
        follower: currentUserId,
        following: followingId
      });

      if (insertError) {
        console.error('Erro ao seguir usuário:', insertError);
        return false; // Mantém como não seguindo já que a operação falhou
      }
      
      return true; // Agora está seguindo
    }
  } catch (error) {
    console.error('Erro ao atualizar relação de follow:', error);
    return false;
  }
};

export const checkIfFollowing = async (
  followingId: string,
  currentUserId: string
): Promise<boolean> => {
  try {
    const { data: isFollowing, error } = await supabase
      .rpc('is_following', { 
        follower: currentUserId, 
        following: followingId 
      });

    if (error) {
      console.error('Erro ao verificar se está seguindo:', error);
      return false;
    }

    return isFollowing || false;
  } catch (error) {
    console.error('Erro ao verificar se está seguindo:', error);
    return false;
  }
};
