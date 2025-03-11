
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth/useAuth';
import { CommunityPost, CreatePostInput } from '@/types/community';
import { toast } from 'sonner';

export const useCommunityPosts = (category?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Query to fetch posts
  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: ['community-posts', category],
    queryFn: async () => {
      let query = supabase
        .from('community_posts')
        .select(`
          *,
          user:profiles(username, avatar, display_name),
          likes_count:post_likes(count),
          comments_count:post_comments(count)
        `);

      if (category) {
        query = query.eq('category', category);
      }

      query = query.order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(post => ({
        ...post,
        likes_count: post.likes_count?.[0]?.count || 0,
        comments_count: post.comments_count?.[0]?.count || 0,
      })) as CommunityPost[];
    }
  });

  // Mutation to create a post
  const createPost = useMutation({
    mutationFn: async (postData: CreatePostInput): Promise<CommunityPost> => {
      if (!user) throw new Error('User must be logged in to create a post');

      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          title: postData.title,
          content: postData.content,
          category: postData.category,
          user_id: user.id,
          is_pinned: postData.is_pinned || false,
          is_featured: postData.is_featured || false
        })
        .select()
        .single();

      if (error) throw error;
      return data as CommunityPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      toast.success('Publicação criada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar publicação: ' + error.message);
    }
  });

  // Mutation to delete a post
  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('User must be logged in to delete a post');

      // First delete all comments
      await supabase
        .from('post_comments')
        .delete()
        .eq('post_id', postId);

      // Then delete all likes
      await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId);

      // Finally delete the post
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) throw error;
      return postId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      toast.success('Publicação excluída com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao excluir publicação: ' + error.message);
    }
  });

  // Mutation to like a post
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
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
    onError: (error) => {
      toast.error('Erro ao curtir/descurtir: ' + error.message);
    }
  });

  return {
    posts: data,
    isLoading,
    error,
    createPost,
    deletePost,
    likePost,
    refetch
  };
};
