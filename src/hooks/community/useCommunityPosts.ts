
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CommunityPost, CreatePostInput } from '@/types/community';
import { useAuth } from '@/hooks/auth/useAuth';

export const useCommunityPosts = (category?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const fetchPosts = async (): Promise<CommunityPost[]> => {
    let query = supabase
      .from('community_posts')
      .select(`
        *,
        user:profiles(username, display_name, avatar)
      `);

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

    return (data || []) as CommunityPost[];
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
    mutationFn: async (newPost: CreatePostInput) => {
      if (!user) {
        throw new Error('Você precisa estar logado para criar um post');
      }

      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          title: newPost.title,
          content: newPost.content,
          category: newPost.category,
          user_id: newPost.user_id,
          is_pinned: newPost.is_pinned || false,
          is_featured: newPost.is_featured || false
        })
        .select();

      if (error) {
        console.error('Error creating post:', error);
        throw new Error(error.message);
      }

      return (data?.[0] || null) as CommunityPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
      toast.success('Post criado com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao criar post: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
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
      toast.error(`Erro ao excluir post: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });

  return {
    posts,
    isLoading,
    error,
    createPost,
    deletePost,
    refetch
  };
};
