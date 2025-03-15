
import { supabase } from '../integrations/supabase/client';
import { Post, Comment, PostLike } from '../models/Post';
import { toast } from 'sonner';

// Função para buscar posts com dados do autor
export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        profiles:user_id (
          username,
          display_name,
          avatar
        )
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    // Formatar os dados para corresponder à interface Post
    return data.map(post => ({
      ...post,
      author: post.profiles ? {
        username: post.profiles.username,
        displayName: post.profiles.display_name,
        avatar: post.profiles.avatar
      } : undefined
    }));
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    toast.error('Não foi possível carregar os posts');
    return [];
  }
};

// Função para buscar um post específico
export const fetchPostById = async (postId: string): Promise<Post | null> => {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        profiles:user_id (
          username,
          display_name,
          avatar
        )
      `)
      .eq('id', postId)
      .single();

    if (error) throw error;

    return {
      ...data,
      author: data.profiles ? {
        username: data.profiles.username,
        displayName: data.profiles.display_name,
        avatar: data.profiles.avatar
      } : undefined
    };
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    toast.error('Não foi possível carregar o post');
    return null;
  }
};

// Função para criar um novo post
export const createPost = async (post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'comments_count'>): Promise<Post | null> => {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        title: post.title,
        content: post.content,
        category: post.category,
        user_id: post.user_id,
        is_featured: post.is_featured || false,
        is_pinned: post.is_pinned || false
      })
      .select()
      .single();

    if (error) throw error;
    
    toast.success('Post criado com sucesso!');
    return data;
  } catch (error) {
    console.error('Erro ao criar post:', error);
    toast.error('Não foi possível criar o post');
    return null;
  }
};

// Função para buscar comentários de um post
export const fetchCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  try {
    const { data, error } = await supabase
      .from('post_comments')
      .select(`
        *,
        profiles:user_id (
          username,
          display_name,
          avatar
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data.map(comment => ({
      ...comment,
      author: comment.profiles ? {
        username: comment.profiles.username,
        displayName: comment.profiles.display_name,
        avatar: comment.profiles.avatar
      } : undefined
    }));
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    toast.error('Não foi possível carregar os comentários');
    return [];
  }
};

// Função para adicionar um comentário
export const addComment = async (comment: Omit<Comment, 'id' | 'created_at' | 'updated_at' | 'likes_count'>): Promise<Comment | null> => {
  try {
    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: comment.post_id,
        user_id: comment.user_id,
        content: comment.content
      })
      .select()
      .single();

    if (error) throw error;
    
    toast.success('Comentário adicionado!');
    return data;
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    toast.error('Não foi possível adicionar o comentário');
    return null;
  }
};

// Função para dar like em um post
export const likePost = async (postId: string, userId: string): Promise<boolean> => {
  try {
    // Verifica se o usuário já deu like
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingLike) {
      // Se já existe um like, remove (unlike)
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('id', existingLike.id);

      if (error) throw error;
      
      toast.success('Like removido');
      return false;
    } else {
      // Se não existe, adiciona um like
      const { error } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: userId
        });

      if (error) throw error;
      
      toast.success('Post curtido!');
      return true;
    }
  } catch (error) {
    console.error('Erro ao interagir com like:', error);
    toast.error('Não foi possível processar sua curtida');
    return false;
  }
};

// Função para verificar se o usuário deu like em um post
export const checkUserLike = async (postId: string, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error('Erro ao verificar like:', error);
    return false;
  }
};
