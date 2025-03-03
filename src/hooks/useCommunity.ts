
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Post, Comment } from '@/types/community';

export const useCommunityPosts = () => {
  // Função para buscar posts
  const fetchPosts = async (): Promise<Post[]> => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(username, avatar)')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      return [];
    }
  };

  // Usamos o useQuery para gerenciar o estado dos posts
  return useQuery({
    queryKey: ['communityPosts'],
    queryFn: fetchPosts,
    refetchOnWindowFocus: false,
    retry: 1,
    // Esta opção impede que o erro seja lançado quando não há QueryClientProvider
    // e permite que a página renderize sem erros
    throwOnError: false,
  });
};

export const useCreatePost = () => {
  const createPost = async (postData: Omit<Post, 'id' | 'created_at' | 'profiles'>): Promise<Post | null> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Usuário não autenticado');
      
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          ...postData,
          user_id: userData.user.id
        }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar post:', error);
      return null;
    }
  };

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // Aqui poderíamos invalidar a query de posts para refrescar a lista
      // queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
    },
  });
};

// Hook para comentários
export const usePostComments = (postId: string) => {
  const fetchComments = async (): Promise<Comment[]> => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*, profiles(username, avatar)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      return [];
    }
  };

  return useQuery({
    queryKey: ['postComments', postId],
    queryFn: fetchComments,
    enabled: !!postId,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });
};

export const useCreateComment = () => {
  const createComment = async (commentData: Omit<Comment, 'id' | 'created_at' | 'profiles'>): Promise<Comment | null> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Usuário não autenticado');
      
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          ...commentData,
          user_id: userData.user.id
        }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar comentário:', error);
      return null;
    }
  };

  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      // Aqui poderíamos invalidar a query de comentários
      // queryClient.invalidateQueries({ queryKey: ['postComments', commentData.post_id] });
    },
  });
};
