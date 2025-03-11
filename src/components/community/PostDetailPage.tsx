
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import { Textarea } from '@/components/ui/textarea';
import { useCommunityPosts, usePostComments } from '@/hooks/community';
import { useLikes } from '@/hooks/community/useLikes';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, Heart, MessageSquare, Share2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { posts, isLoading: isPostsLoading, deletePost } = useCommunityPosts();
  const { comments, isLoading: isCommentsLoading, createComment, deleteComment } = usePostComments(postId || '');
  const { likes, isLoading: isLikesLoading, addLike, removeLike } = useLikes(postId || '');
  
  const post = posts.find(post => post.id === postId);
  const [commentContent, setCommentContent] = useState('');
  const isPostLoading = isPostsLoading || !post;

  const isLiked = likes.some(like => like.user_id === user?.id);

  const handleCreateComment = async () => {
    if (commentContent.trim() === '') {
      toast('O comentário não pode estar vazio.', {
        description: 'Por favor, escreva algo antes de comentar.',
      });
      return;
    }

    try {
      await createComment.mutateAsync(commentContent);
      setCommentContent('');
    } catch (error) {
      toast('Erro ao criar comentário', {
        description: 'Ocorreu um erro ao tentar criar seu comentário.',
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment.mutateAsync(commentId);
    } catch (error) {
      toast('Erro ao excluir comentário', {
        description: 'Ocorreu um erro ao tentar excluir o comentário.',
      });
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await removeLike.mutateAsync(postId || '');
      } else {
        await addLike.mutateAsync(postId || '');
      }
    } catch (error) {
      toast('Erro ao curtir/descurtir o post', {
        description: 'Ocorreu um erro ao processar sua ação.',
      });
    }
  };

  const handleDeletePost = async () => {
    if (!postId) return;

    try {
      await deletePost.mutateAsync(postId);
      navigate('/community');
    } catch (error) {
      toast('Erro ao excluir o post', {
        description: 'Ocorreu um erro ao tentar excluir a publicação.',
      });
    }
  };

  if (isPostLoading) {
    return (
      <div className="container mx-auto mt-10 p-4">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 p-4 text-white">
      <Link to="/community" className="flex items-center text-blue-500 hover:text-blue-400 transition-colors mb-4">
        <ChevronLeft className="mr-2 h-5 w-5" />
        Voltar para a comunidade
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{post?.title}</h1>
        <div className="flex items-center text-gray-400 mb-2">
          <Avatar className="mr-2 h-6 w-6">
            <AvatarImage src={post?.user?.avatar || ''} alt={post?.user?.username || 'Avatar'} />
            <AvatarFallback>{post?.user?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span>
            {post?.user?.display_name || post?.user?.username} - Publicado{' '}
            {post?.created_at ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR }) : 'há pouco tempo'}
          </span>
        </div>
        {post?.category && (
          <Badge className="bg-purple-800/20 border border-purple-700/50 text-purple-300">{post.category}</Badge>
        )}
        <p className="text-gray-300 mt-2">{post?.content}</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <Button variant="ghost" size="sm" className="mr-2" onClick={handleLike} disabled={isLikesLoading}>
            <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'text-red-500' : 'text-gray-400'}`} fill={isLiked ? 'red' : 'none'} />
            {likes.length} Curtidas
          </Button>
          <Button variant="ghost" size="sm" className="mr-2">
            <MessageSquare className="mr-2 h-4 w-4 text-gray-400" />
            {comments.length} Comentários
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="mr-2 h-4 w-4 text-gray-400" />
            Compartilhar
          </Button>
        </div>
        {user?.id === post?.user_id && (
          <Button variant="outline" size="sm" className="bg-red-800/20 hover:bg-red-800/40 border-red-700/50 text-red-300" onClick={handleDeletePost}>
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir Post
          </Button>
        )}
      </div>

      <div className="mb-6">
        <Textarea
          placeholder="Adicione um comentário..."
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          className="bg-black/80 border-gray-700 text-white shadow-sm focus-visible:ring-1 focus-visible:ring-purple-500"
        />
        <Button onClick={handleCreateComment} className="mt-2">
          Comentar
        </Button>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Comentários:</h3>
        {isCommentsLoading ? (
          <div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="mb-4 p-3 rounded-md bg-black/30 border border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-center text-gray-400 mb-2">
                  <Avatar className="mr-2 h-6 w-6">
                    <AvatarImage src={comment.user?.avatar || ''} alt={comment.user?.username || 'Avatar'} />
                    <AvatarFallback>{comment.user?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>{comment.user?.display_name || comment.user?.username}</span>
                </div>
                {user?.id === comment.user_id && (
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400" onClick={() => handleDeleteComment(comment.id || '')}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-gray-300">{comment.content}</p>
              <small className="text-gray-500">
                {comment.created_at ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ptBR }) : 'há pouco tempo'}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;
