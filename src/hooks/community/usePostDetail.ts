
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Comment, CommunityPost, User } from '@/types/community';
import { useToast } from '@/components/ui/use-toast';

export const usePostDetail = (postId: string | undefined) => {
  const navigate = useNavigate();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommentLoading, setIsCommentLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id);
    };
    
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('community_posts')
          .select('*, profiles(username, avatar, display_name)')
          .eq('id', postId)
          .single();
          
        if (error) throw error;
        
        // Transform the data to match CommunityPost type
        const communityPost: CommunityPost = {
          ...data,
          user: {
            username: data.profiles?.username || '',
            display_name: data.profiles?.display_name || '',
            avatar: data.profiles?.avatar || null
          }
        };
        
        setPost(communityPost);
      } catch (error) {
        console.error('Erro ao buscar post:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar publicação",
          description: "Não foi possível carregar a publicação solicitada."
        });
        navigate('/community');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchComments = async () => {
      if (!postId) return;
      
      try {
        setIsCommentLoading(true);
        const { data, error } = await supabase
          .from('post_comments')
          .select('*, profiles(username, avatar, display_name)')
          .eq('post_id', postId)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        // Transform comments to include user property with correct type
        const formattedComments: Comment[] = data.map(comment => ({
          ...comment,
          user: {
            username: comment.profiles?.username || '',
            display_name: comment.profiles?.display_name || '',
            avatar: comment.profiles?.avatar || null
          }
        }));
        
        setComments(formattedComments);
      } catch (error) {
        console.error('Erro ao buscar comentários:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar comentários",
          description: "Não foi possível carregar os comentários desta publicação."
        });
      } finally {
        setIsCommentLoading(false);
      }
    };

    fetchPost();
    fetchComments();
  }, [postId, navigate, toast]);

  const handleLikePost = async () => {
    if (!post) return;
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        navigate('/auth');
        return;
      }

      // Toggle like logic
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "A função de curtir posts estará disponível em breve."
      });
    } catch (error) {
      console.error('Erro ao curtir post:', error);
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;
    
    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', post.id);
        
      if (error) throw error;
      
      toast({
        title: "Publicação excluída",
        description: "Sua publicação foi excluída com sucesso."
      });
      
      navigate('/community');
    } catch (error) {
      console.error('Erro ao deletar post:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir publicação",
        description: "Não foi possível excluir a publicação. Tente novamente."
      });
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        navigate('/auth');
        return;
      }
      
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "A função de curtir comentários estará disponível em breve."
      });
    } catch (error) {
      console.error('Erro ao curtir comentário:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('post_comments')
        .delete()
        .eq('id', commentId);
        
      if (error) throw error;
      
      // Refresh comments
      setComments(comments.filter(comment => comment.id !== commentId));
      
      toast({
        title: "Comentário excluído",
        description: "Seu comentário foi excluído com sucesso."
      });
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir comentário",
        description: "Não foi possível excluir o comentário. Tente novamente."
      });
    }
  };

  const handleSubmitComment = async (content: string) => {
    if (!postId || !currentUserId || !content.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert([{
          content,
          post_id: postId,
          user_id: currentUserId
        }])
        .select('*, profiles(username, avatar, display_name)')
        .single();
        
      if (error) throw error;
      
      // Add new comment to list with properly formatted user property
      const newComment: Comment = {
        ...data,
        user: {
          username: data.profiles?.username || '',
          display_name: data.profiles?.display_name || '',
          avatar: data.profiles?.avatar || null
        }
      };
      
      setComments([...comments, newComment]);
      
      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi publicado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao criar comentário:', error);
      toast({
        variant: "destructive",
        title: "Erro ao publicar comentário",
        description: "Não foi possível publicar seu comentário. Tente novamente."
      });
    }
  };
  
  return {
    post,
    comments,
    isLoading,
    isCommentLoading,
    currentUserId,
    handleLikePost,
    handleDeletePost,
    handleLikeComment,
    handleDeleteComment,
    handleSubmitComment
  };
};
