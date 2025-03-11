import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth/useAuth';
import { PostLike, CommentLike } from '@/types/community';
import { toast } from 'sonner';

export const useLikes = (postId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Query to fetch likes for a post
  const { data: likes = [], isLoading, error } = useQuery({
    queryKey: ['post-likes', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('post_likes')
        .select('*')
        .eq('post_id', postId);
      
      if (error) throw error;
      return data as PostLike[];
    },
    enabled: !!postId,
  });

  // Mutation to add a like to a post
  const addLike = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('User must be logged in to like a post');
      
      const { data, error } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return { action: 'added', postId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-likes', postId] });
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
    onError: (error) => {
      toast.error('Erro ao curtir o post: ' + error.message);
    }
  });

  // Mutation to remove a like from a post
  const removeLike = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('User must be logged in to unlike a post');
      
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return { action: 'removed', postId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-likes', postId] });
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
    onError: (error) => {
      toast.error('Erro ao remover curtida: ' + error.message);
    }
  });

  // Original like mutations (keeping for backward compatibility)
  const likePost = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('User must be logged in to like a post');
      
      // Check if user already liked the post
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();
      
      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('id', existingLike.id);
        
        if (error) throw error;
        return { action: 'removed', postId };
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id,
          });
        
        if (error) throw error;
        return { action: 'added', postId };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-likes', postId] });
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
    onError: (error) => {
      toast.error('Erro ao curtir/descurtir: ' + error.message);
    }
  });

  // Mutation to like a comment
  const likeComment = useMutation({
    mutationFn: async (commentId: string) => {
      if (!user) throw new Error('User must be logged in to like a comment');
      
      // Check if user already liked the comment
      const { data: existingLike } = await supabase
        .from('comment_likes')
        .select('*')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .single();
      
      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('comment_likes')
          .delete()
          .eq('id', existingLike.id);
        
        if (error) throw error;
        return { action: 'removed', commentId };
      } else {
        // Like
        const { error } = await supabase
          .from('comment_likes')
          .insert({
            comment_id: commentId,
            user_id: user.id,
          });
        
        if (error) throw error;
        return { action: 'added', commentId };
      }
    },
    onSuccess: (_, commentId) => {
      queryClient.invalidateQueries({ queryKey: ['comment-likes', commentId] });
      queryClient.invalidateQueries({ queryKey: ['post-comments', postId] });
    },
    onError: (error) => {
      toast.error('Erro ao curtir/descurtir comentário: ' + error.message);
    }
  });

  return {
    likes,
    isLoading,
    error,
    likePost,
    likeComment,
    addLike,
    removeLike
  };
};
