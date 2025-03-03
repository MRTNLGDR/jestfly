
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2 } from 'lucide-react';
import PostDetail from './PostDetail';
import CommentsList from './CommentsList';
import CommentForm from './CommentForm';
import CommunityNav from './CommunityNav';
import GlassHeader from '@/components/GlassHeader';
import { mainMenuItems } from '@/constants/menuItems';
import { supabase } from '@/integrations/supabase/client';
import { Post, Comment } from '@/types/community';
import { useToast } from '@/components/ui/use-toast';

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
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
          .select('*, profiles(username, avatar)')
          .eq('id', postId)
          .single();
          
        if (error) throw error;
        
        setPost(data as unknown as Post);
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
          .select('*, profiles(username, avatar)')
          .eq('post_id', postId)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        setComments(data as unknown as Comment[]);
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
        .select('*, profiles(username, avatar)')
        .single();
        
      if (error) throw error;
      
      // Add new comment to list
      setComments([...comments, data as unknown as Comment]);
      
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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950">
      <GlassHeader menuItems={mainMenuItems} />
      
      <div className="pt-16">
        <CommunityNav />
        
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            className="mb-6 text-white/80 hover:text-white"
            onClick={() => navigate('/community')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para Comunidade
          </Button>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : post ? (
            <div className="space-y-8">
              <PostDetail 
                post={post} 
                isOwner={currentUserId === post.user_id}
                onLike={handleLikePost}
                onDelete={handleDeletePost}
              />
              
              <div className="bg-black/30 backdrop-blur-md rounded-lg p-6 border border-purple-500/20">
                <h3 className="text-xl font-bold text-white mb-4">Comentários</h3>
                <CommentsList 
                  comments={comments}
                  isLoading={isCommentLoading}
                  currentUserId={currentUserId}
                  onLikeComment={handleLikeComment}
                  onDeleteComment={handleDeleteComment}
                />
                <div className="mt-6">
                  <CommentForm 
                    isLoggedIn={!!currentUserId}
                    onSubmit={handleSubmitComment}
                    isPending={false}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 bg-black/20 rounded-lg">
              <p className="text-white/60">Post não encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
