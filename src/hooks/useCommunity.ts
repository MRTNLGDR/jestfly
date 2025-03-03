
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { toast } from 'sonner';
import { CommunityPost, PostComment, PostCategory, TablesInsert } from '@/types/community';
import { useAuth } from '@/contexts/AuthContext';

export const useCommunityPosts = (category?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const fetchPosts = async (): Promise<CommunityPost[]> => {
    // Usar uma abordagem mais direta para evitar problemas de tipagem
    let query = supabase.from('community_posts').select(`
      *,
      user:profiles(username, display_name, avatar)
    `);

    // Filtrar por categoria se especificada
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    query = query.order('is_pinned', { ascending: false })
                .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching community posts:', error);
      throw new Error(error.message);
    }

    // Converter explicitamente para nosso tipo
    return (data || []) as unknown as CommunityPost[];
  };

  const {
    data: posts = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['communityPosts', category],
    queryFn: fetchPosts
  });

  const createPost = useMutation({
    mutationFn: async (newPost: TablesInsert['community_posts']) => {
      if (!user) {
        throw new Error('Você precisa estar logado para criar um post');
      }

      const { data, error } = await supabase
        .from('community_posts')
        .insert(newPost)
        .select();

      if (error) {
        console.error('Error creating post:', error);
        throw new Error(error.message);
      }

      return (data?.[0] || null) as unknown as CommunityPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
      toast.success('Post criado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao criar post: ${error.message}`);
    }
  });

  const likePost = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) {
        throw new Error('Você precisa estar logado para curtir um post');
      }

      // Verificar se já existe um like
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Se já curtiu, remove a curtida
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) {
          throw new Error(error.message);
        }
        
        return { action: 'unliked', postId };
      }

      // Se não curtiu, adiciona a curtida
      const likeData: TablesInsert['post_likes'] = {
        post_id: postId,
        user_id: user.id
      };

      const { error } = await supabase
        .from('post_likes')
        .insert(likeData);

      if (error) {
        throw new Error(error.message);
      }

      return { action: 'liked', postId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
      if (data.action === 'liked') {
        toast.success('Post curtido!');
      } else {
        toast.success('Curtida removida!');
      }
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    }
  });

  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) {
        throw new Error('Você precisa estar logado para excluir um post');
      }

      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
      toast.success('Post excluído com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao excluir post: ${error.message}`);
    }
  });

  return {
    posts,
    isLoading,
    error,
    createPost,
    likePost,
    deletePost,
    refetch
  };
};

export const usePostComments = (postId: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const fetchComments = async (): Promise<PostComment[]> => {
    if (!postId) return [];

    const { data, error } = await supabase
      .from('post_comments')
      .select(`
        *,
        user:profiles(username, display_name, avatar)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      throw new Error(error.message);
    }

    return (data || []) as unknown as PostComment[];
  };

  const {
    data: comments = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['postComments', postId],
    queryFn: fetchComments,
    enabled: !!postId
  });

  const createComment = useMutation({
    mutationFn: async (content: string) => {
      if (!user) {
        throw new Error('Você precisa estar logado para comentar');
      }

      const commentData: TablesInsert['post_comments'] = {
        post_id: postId,
        user_id: user.id,
        content
      };

      const { data, error } = await supabase
        .from('post_comments')
        .insert(commentData)
        .select();

      if (error) {
        console.error('Error creating comment:', error);
        throw new Error(error.message);
      }

      return (data?.[0] || null) as unknown as PostComment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
      toast.success('Comentário adicionado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao comentar: ${error.message}`);
    }
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      if (!user) {
        throw new Error('Você precisa estar logado para excluir um comentário');
      }

      const { error } = await supabase
        .from('post_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
      toast.success('Comentário excluído com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao excluir comentário: ${error.message}`);
    }
  });

  const likeComment = useMutation({
    mutationFn: async (commentId: string) => {
      if (!user) {
        throw new Error('Você precisa estar logado para curtir um comentário');
      }

      // Verificar se já existe um like
      const { data: existingLike } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Se já curtiu, remove a curtida
        const { error } = await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);

        if (error) {
          throw new Error(error.message);
        }
        
        return { action: 'unliked', commentId };
      }

      // Se não curtiu, adiciona a curtida
      const likeData: TablesInsert['comment_likes'] = {
        comment_id: commentId,
        user_id: user.id
      };

      const { error } = await supabase
        .from('comment_likes')
        .insert(likeData);

      if (error) {
        throw new Error(error.message);
      }

      return { action: 'liked', commentId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
      if (data.action === 'liked') {
        toast.success('Comentário curtido!');
      } else {
        toast.success('Curtida removida!');
      }
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    }
  });

  return {
    comments,
    isLoading,
    error,
    createComment,
    deleteComment,
    likeComment,
    refetch
  };
};
