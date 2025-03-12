
import React, { useState, useEffect } from 'react';
import { Heart, Clock } from 'lucide-react';
import { Comment } from '../../models/Post';
import { useAuth } from '../../contexts/auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { fetchCommentsByPostId, addComment } from '../../services/feedService';
import { toast } from 'sonner';

interface CommentsListProps {
  postId: string;
  onClose: () => void;
}

const CommentsList: React.FC<CommentsListProps> = ({ postId, onClose }) => {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const commentsData = await fetchCommentsByPostId(postId);
      setComments(commentsData);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Você precisa estar logado para comentar');
      return;
    }
    
    if (!newComment.trim()) {
      toast.error('O comentário não pode estar vazio');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const comment = await addComment({
        post_id: postId,
        user_id: currentUser.id,
        content: newComment
      });
      
      if (comment) {
        // Para experiência de usuário melhor, adicionamos o autor manualmente
        // já que o backend não retorna esses dados na inserção
        const commentWithAuthor = {
          ...comment,
          author: {
            username: currentUser.email.split('@')[0],
            displayName: currentUser.email,
            avatar: null
          }
        };
        
        setComments(prev => [...prev, commentWithAuthor]);
        setNewComment('');
        toast.success('Comentário adicionado!');
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      toast.error('Não foi possível adicionar seu comentário');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch (e) {
      return 'data desconhecida';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="neo-blur w-full max-w-lg h-[80vh] rounded-xl overflow-hidden border border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Comentários</h2>
          <Button variant="ghost" onClick={onClose} className="text-white/70 hover:text-white hover:bg-white/10">
            Fechar
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-t-purple-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <p>Seja o primeiro a comentar</p>
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="bg-black/20 p-3 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8 bg-gradient-to-r from-purple-500 to-blue-500">
                    {comment.author?.avatar ? (
                      <AvatarImage src={comment.author.avatar} alt={comment.author.displayName} />
                    ) : (
                      <AvatarFallback>
                        {comment.author ? getInitials(comment.author.displayName) : 'U'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="font-medium text-white text-sm">
                        {comment.author?.displayName || 'Usuário'}
                      </p>
                      <span className="mx-2 text-xs text-white/60">•</span>
                      <p className="text-xs text-white/60 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(comment.created_at)}
                      </p>
                    </div>
                    <p className="text-white/80 text-sm mt-1">{comment.content}</p>
                    
                    <div className="flex items-center mt-2">
                      <button className="flex items-center space-x-1 text-white/50 hover:text-pink-500 text-xs">
                        <Heart className="h-3.5 w-3.5" />
                        <span>{comment.likes_count || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <form onSubmit={handleSubmitComment} className="p-4 border-t border-white/10">
          <div className="flex space-x-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Adicione um comentário..."
              className="flex-1 bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-12 min-h-[48px] max-h-32"
              rows={1}
            />
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              disabled={!currentUser || isSubmitting}
            >
              {isSubmitting ? '...' : 'Enviar'}
            </Button>
          </div>
          {!currentUser && (
            <p className="mt-2 text-xs text-white/50">
              Você precisa estar logado para comentar
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CommentsList;
