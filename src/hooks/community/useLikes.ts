
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth/useAuth';

export const useLikes = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const likePost = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) {
        throw new Error('Você precisa estar logado para curtir um post');
      }

      const { data: existingLike, error: checkError } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError) {
        throw new Error(checkError.message);
      }

      if (existingLike) {
        const { error: deleteError } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (deleteError) {
          throw new Error(deleteError.message);
        }
        
        return { action: 'unliked', postId };
      }

      const { error: insertError } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: user.id
        } as any);

      if (insertError) {
        throw new Error(insertError.message);
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
      toast.error(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });

  const likeComment = useMutation({
    mutationFn: async (commentId: string) => {
      if (!user) {
        throw new Error('Você precisa estar logado para curtir um comentário');
      }

      const { data: existingLike, error: checkError } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError) {
        throw new Error(checkError.message);
      }

      if (existingLike) {
        const { error: deleteError } = await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);

        if (deleteError) {
          throw new Error(deleteError.message);
        }
        
        return { action: 'unliked', commentId };
      }

      const { error: insertError } = await supabase
        .from('comment_likes')
        .insert({
          comment_id: commentId,
          user_id: user.id
        } as any);

      if (insertError) {
        throw new Error(insertError.message);
      }

      return { action: 'liked', commentId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['postComments'] });
      if (data.action === 'liked') {
        toast.success('Comentário curtido!');
      } else {
        toast.success('Curtida removida!');
      }
    },
    onError: (error) => {
      toast.error(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });

  return {
    likePost,
    likeComment
  };
};
