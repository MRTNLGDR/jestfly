
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Clock } from 'lucide-react';
import { Post } from '../../models/Post';
import { useAuth } from '../../contexts/auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { likePost, checkUserLike } from '../../services/feedService';
import { toast } from 'sonner';

interface PostCardProps {
  post: Post;
  onCommentClick: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onCommentClick }) => {
  const { currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  
  useEffect(() => {
    // Verifica se o usuário atual já deu like no post
    const checkLikeStatus = async () => {
      if (currentUser) {
        const hasLiked = await checkUserLike(post.id, currentUser.id);
        setIsLiked(hasLiked);
      }
    };
    
    checkLikeStatus();
  }, [post.id, currentUser]);

  const handleLike = async () => {
    if (!currentUser) {
      toast.error('Você precisa estar logado para curtir posts');
      return;
    }
    
    // Otimistic UI update
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    
    try {
      const liked = await likePost(post.id, currentUser.id);
      
      // Revert if server response doesn't match optimistic update
      if (liked !== !isLiked) {
        setIsLiked(liked);
        setLikesCount(prev => liked ? prev + 1 : prev - 1);
      }
    } catch (error) {
      // Revert on error
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      console.error('Erro ao processar like:', error);
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
    <div className="neo-blur rounded-xl overflow-hidden border border-white/10 transition-all duration-300 hover:border-purple-500/30">
      {/* Post header */}
      <div className="p-4 flex items-center space-x-3">
        <Avatar className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500">
          {post.author?.avatar ? (
            <AvatarImage src={post.author.avatar} alt={post.author.displayName} />
          ) : (
            <AvatarFallback>
              {post.author ? getInitials(post.author.displayName) : 'U'}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center">
            <p className="font-medium text-white">
              {post.author?.displayName || 'Usuário'}
            </p>
            <span className="mx-2 text-xs text-white/60">•</span>
            <p className="text-xs text-white/60 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(post.created_at)}
            </p>
          </div>
          <p className="text-xs text-white/60">
            @{post.author?.username || 'usuario'}
          </p>
        </div>
        
        <button className="text-white/70 hover:text-white p-1">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      
      {/* Post content */}
      <div className="px-4 pb-3">
        <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
        <p className="text-white/80 whitespace-pre-line">{post.content}</p>
      </div>
      
      {/* Post actions */}
      <div className="px-4 py-3 flex items-center space-x-6 border-t border-white/5">
        <button 
          className={`flex items-center space-x-1.5 ${isLiked ? 'text-pink-500' : 'text-white/70 hover:text-pink-500'} transition-colors`}
          onClick={handleLike}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-pink-500' : ''}`} />
          <span className="text-sm">{likesCount}</span>
        </button>
        
        <button 
          className="flex items-center space-x-1.5 text-white/70 hover:text-blue-500 transition-colors"
          onClick={() => onCommentClick(post.id)}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm">{post.comments_count || 0}</span>
        </button>
        
        <button className="flex items-center space-x-1.5 text-white/70 hover:text-green-500 transition-colors">
          <Share2 className="h-5 w-5" />
        </button>
      </div>
      
      {/* Tags */}
      {post.category && (
        <div className="px-4 pb-4 flex flex-wrap gap-2">
          <Badge 
            variant="outline" 
            className="bg-purple-900/30 text-purple-400 border-purple-700/40"
          >
            #{post.category}
          </Badge>
          {post.is_featured && (
            <Badge 
              variant="outline" 
              className="bg-blue-900/30 text-blue-400 border-blue-700/40"
            >
              #destaque
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
