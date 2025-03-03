
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Comment } from '@/types/community';
import { useToast } from '@/components/ui/use-toast';

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id);
    };
    
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('post_comments')
          .select('*, profiles(username, avatar, display_name)')
          .eq('post_id', postId)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        // Transform raw data to Comment type with user property
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
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId, toast]);

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
      
      // Add new comment with properly formatted user data
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
      
      return true;
    } catch (error) {
      console.error('Erro ao criar comentário:', error);
      toast({
        variant: "destructive",
        title: "Erro ao publicar comentário",
        description: "Não foi possível publicar seu comentário. Tente novamente."
      });
      return false;
    }
  };

  return {
    comments,
    isLoading,
    currentUserId,
    handleLikeComment,
    handleDeleteComment,
    handleSubmitComment
  };
};
