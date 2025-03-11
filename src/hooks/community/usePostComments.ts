
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PostComment } from '@/types/community';
import { useAuth } from '@/hooks/auth/useAuth';

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

    return (data || []) as PostComment[];
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

      const commentData = {
        post_id: postId,
        user_id: user.id,
        content
      };

      const { data, error } = await supabase
        .from('post_comments')
        .insert(commentData as any)
        .select();

      if (error) {
        console.error('Error creating comment:', error);
        throw new Error(error.message);
      }

      return (data?.[0] || null) as PostComment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
      toast.success('Comentário adicionado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao comentar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
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
      toast.error(`Erro ao excluir comentário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });

  return {
    comments,
    isLoading,
    error,
    createComment,
    deleteComment,
    refetch
  };
};
