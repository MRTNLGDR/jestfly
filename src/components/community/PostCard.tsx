
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageSquare, Heart, AlertCircle, Calendar, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { CommunityPost } from '@/types/community';

interface PostCardProps {
  post: CommunityPost;
  handleLikePost: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, handleLikePost }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'announcement':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'discussion':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'collaboration':
        return <Users className="h-5 w-5 text-green-500" />;
      case 'question':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <MessageSquare className="h-5 w-5" />;
    }
  };

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

  return (
    <Card className={`overflow-hidden transition-all duration-300 bg-black/40 backdrop-blur-md border border-white/10 ${post.is_featured ? 'shadow-[0_0_15px_rgba(139,92,246,0.3)]' : ''}`}>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.user?.avatar} alt={post.user?.username} />
              <AvatarFallback>{post.user?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.user?.display_name || post.user?.username}</p>
              <p className="text-xs text-gray-400">
                {post.created_at && formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR })}
              </p>
            </div>
          </div>
          {post.category && (
            <Badge className="bg-purple-800/20 border border-purple-700/50 text-purple-300 flex items-center gap-1">
              {getCategoryIcon(post.category)}
              <span>{formatCategoryName(post.category)}</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <Link to={`/community/post/${post.id}`} className="block">
          <h3 className="text-xl font-semibold mb-2 hover:text-purple-400 transition-colors line-clamp-2">{post.title}</h3>
          <p className="text-gray-300 line-clamp-3">{post.content}</p>
        </Link>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between text-gray-400">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:text-purple-400"
            onClick={() => handleLikePost(post.id)}
          >
            <Heart className="h-4 w-4 mr-1" />
            <span>{post.likes_count || 0}</span>
          </Button>
          
          <Link to={`/community/post/${post.id}`} className="flex items-center hover:text-purple-400">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{post.comments_count || 0}</span>
          </Link>
        </div>
        
        {post.is_pinned && (
          <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
            Fixado
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;
