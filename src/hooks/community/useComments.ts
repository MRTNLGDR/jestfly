
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Comment } from '@/types/community';

// Hook para comentários
export const usePostComments = (postId: string) => {
  const queryClient = useQueryClient();
  
  const fetchComments = async (): Promise<Comment[]> => {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select('*, profiles(username, avatar)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      return data as unknown as Comment[];
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      return [];
    }
  };

  // Hook para criar comentário
  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('Usuário não autenticado');
        
        const { data, error } = await supabase
          .from('post_comments')
          .insert([{
            content,
            post_id: postId,
            user_id: userData.user.id
          }])
          .select()
          .single();
          
        if (error) throw error;
        return data as Comment;
      } catch (error) {
        console.error('Erro ao criar comentário:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
    }
  });

  // Hook para deletar comentário
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      try {
        const { error } = await supabase
          .from('post_comments')
          .delete()
          .eq('id', commentId);
          
        if (error) throw error;
      } catch (error) {
        console.error('Erro ao deletar comentário:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
    }
  });

  // Hook para curtir comentário
  const likeCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('Usuário não autenticado');

        // Verificar se já curtiu
        const { data: existingLike } = await supabase
          .from('comment_likes')
          .select()
          .eq('comment_id', commentId)
          .eq('user_id', userData.user.id)
          .single();

        if (existingLike) {
          // Se já curtiu, remover curtida
          const { error } = await supabase
            .from('comment_likes')
            .delete()
            .eq('id', existingLike.id);
            
          if (error) throw error;
        } else {
          // Se não curtiu, adicionar curtida
          const { error } = await supabase
            .from('comment_likes')
            .insert([{ comment_id: commentId, user_id: userData.user.id }]);
            
          if (error) throw error;
        }
      } catch (error) {
        console.error('Erro ao curtir/descurtir comentário:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postComments', postId] });
    }
  });

  const query = useQuery({
    queryKey: ['postComments', postId],
    queryFn: fetchComments,
    enabled: !!postId,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

  return {
    ...query,
    comments: query.data || [],
    createComment: createCommentMutation,
    deleteComment: deleteCommentMutation,
    likeComment: likeCommentMutation
  };
};
