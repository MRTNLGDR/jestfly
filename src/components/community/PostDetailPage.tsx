
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCommunityPosts, usePostComments } from '@/hooks/useCommunity';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, MessageSquare, ThumbsUp, ArrowLeft, Trash2, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CommunityPost } from '@/types/community';

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [commentContent, setCommentContent] = useState('');
  
  const { comments, isLoading: commentsLoading, createComment, deleteComment, likeComment } = usePostComments(postId || '');
  const { likePost, deletePost } = useCommunityPosts();
  
  // Fetch post details
  const fetchPostDetails = async (): Promise<CommunityPost> => {
    if (!postId) throw new Error('Post ID não fornecido');

    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        user:profiles(username, display_name, avatar)
      `)
      .eq('id', postId)
      .single();

    if (error) {
      console.error('Error fetching post details:', error);
      throw new Error(error.message);
    }

    return data as unknown as CommunityPost;
  };

  const {
    data: post,
    isLoading: postLoading,
    error: postError
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: fetchPostDetails,
    enabled: !!postId
  });

  // Função para obter o nome formatado da categoria
  const formatCategoryName = (category: string) => {
    switch (category) {
      case 'announcement':
        return 'Anúncio';
      case 'event':
        return 'Evento';
      case 'discussion':
        return 'Discussão';
      case 'collaboration':
        return 'Colaboração';
      case 'question':
        return 'Pergunta';
      default:
        return category;
    }
  };

  // Função para obter o ícone da categoria
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'announcement':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'event':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case 'discussion':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'collaboration':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'question':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <MessageSquare className="h-5 w-5" />;
    }
  };

  // Função para lidar com a criação de comentários
  const handleCreateComment = async () => {
    if (!commentContent.trim()) return;
    
    try {
      await createComment.mutateAsync(commentContent);
      setCommentContent('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  // Função para deletar um post
  const handleDeletePost = async () => {
    if (!post || !user || user.id !== post.user_id) return;
    
    try {
      await deletePost.mutateAsync(post.id);
      navigate('/community');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Função para deletar um comentário
  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment.mutateAsync(commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Loading state
  if (postLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  // Error state
  if (postError || !post) {
    return (
      <div className="max-w-4xl mx-auto pt-24 px-6">
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="bg-red-900/20 p-8 rounded-lg text-center">
          <p className="text-red-400">Post não encontrado ou erro ao carregar detalhes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-24 px-6 pb-24">
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para a Comunidade
      </Button>
      
      {/* Post Details */}
      <Card className="bg-black/40 backdrop-blur-md border-white/10 mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={post.user?.avatar} alt={post.user?.display_name} />
                <AvatarFallback>{post.user?.display_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-white">{post.user?.display_name || 'Usuário'}</h3>
                <p className="text-sm text-white/60">
                  {formatDistanceToNow(new Date(post.created_at), { locale: ptBR, addSuffix: true })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-black/30 px-3 py-1 rounded-full">
                {getCategoryIcon(post.category)}
                <span className="text-xs text-white/70">{formatCategoryName(post.category)}</span>
              </div>
              
              {user && user.id === post.user_id && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  onClick={handleDeletePost}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white mt-4">{post.title}</h1>
        </CardHeader>
        
        <CardContent>
          <p className="text-white/80 whitespace-pre-line">{post.content}</p>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t border-white/10 pt-4">
          <div className="flex space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => likePost.mutate(post.id)}
              disabled={!user}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>{post.likes_count}</span>
            </Button>
            <div className="flex items-center text-white/70">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{post.comments_count}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
      
      {/* Comments Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Comentários</h2>
        
        {/* Comment Form */}
        {user ? (
          <div className="mb-8">
            <Textarea
              placeholder="Adicione um comentário..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="bg-black/30 border-white/10 text-white resize-none mb-2"
            />
            <Button 
              onClick={handleCreateComment}
              disabled={!commentContent.trim() || createComment.isPending}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {createComment.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Comentar'
              )}
            </Button>
          </div>
        ) : (
          <div className="bg-black/30 p-4 rounded-lg mb-8">
            <p className="text-white/70">
              <Link to="/auth" className="text-purple-400 hover:underline">Faça login</Link> para participar da discussão
            </p>
          </div>
        )}
        
        {/* Comments List */}
        {commentsLoading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
          </div>
        ) : comments.length === 0 ? (
          <div className="bg-black/20 p-6 rounded-lg text-center">
            <p className="text-white/60">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="bg-black/30 border-white/10">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user?.avatar} alt={comment.user?.display_name} />
                        <AvatarFallback>{comment.user?.display_name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-white">{comment.user?.display_name || 'Usuário'}</p>
                        <p className="text-xs text-white/60">
                          {formatDistanceToNow(new Date(comment.created_at), { locale: ptBR, addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    
                    {user && user.id === comment.user_id && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 w-8 p-0"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-white/80">{comment.content}</p>
                </CardContent>
                
                <CardFooter className="flex justify-start pt-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => likeComment.mutate(comment.id)}
                    disabled={!user}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>{comment.likes_count}</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;
