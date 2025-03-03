
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { toast } from 'sonner';
import { CommunityPost, PostComment } from '@/types/community';
import { useAuth } from '@/contexts/AuthContext';

export const useCommunityPosts = (category?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const fetchPosts = async (): Promise<CommunityPost[]> => {
    let query = supabase
      .from('community_posts')
      .select(`
        *,
        user:user_id (
          username,
          display_name,
          avatar
        )
      `)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching community posts:', error);
      throw new Error(error.message);
    }

    return data as unknown as CommunityPost[];
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
    mutationFn: async (newPost: Omit<CommunityPost, 'id' | 'likes_count' | 'comments_count' | 'created_at' | 'updated_at'>) => {
      if (!user) {
        throw new Error('Você precisa estar logado para criar um post');
      }

      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          ...newPost,
          user_id: user.id
        })
        .select();

      if (error) {
        console.error('Error creating post:', error);
        throw new Error(error.message);
      }

      return data[0] as CommunityPost;
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

      const { data, error } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: user.id
        })
        .select();

      if (error) {
        if (error.code === '23505') { // unique_violation
          // Se já curtiu, remove a curtida
          const { error: unlikeError } = await supabase
            .from('post_likes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', user.id);

          if (unlikeError) {
            throw new Error(unlikeError.message);
          }
          
          return { action: 'unliked', postId };
        }
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
    const { data, error } = await supabase
      .from('post_comments')
      .select(`
        *,
        user:user_id (
          username,
          display_name,
          avatar
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      throw new Error(error.message);
    }

    return data as unknown as PostComment[];
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

      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content
        })
        .select();

      if (error) {
        console.error('Error creating comment:', error);
        throw new Error(error.message);
      }

      return data[0] as PostComment;
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

      const { data, error } = await supabase
        .from('comment_likes')
        .insert({
          comment_id: commentId,
          user_id: user.id
        })
        .select();

      if (error) {
        if (error.code === '23505') { // unique_violation
          // Se já curtiu, remove a curtida
          const { error: unlikeError } = await supabase
            .from('comment_likes')
            .delete()
            .eq('comment_id', commentId)
            .eq('user_id', user.id);

          if (unlikeError) {
            throw new Error(unlikeError.message);
          }
          
          return { action: 'unliked', commentId };
        }
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
