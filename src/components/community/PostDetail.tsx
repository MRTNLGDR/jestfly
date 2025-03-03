
import React from 'react';
import { CommunityPost } from '@/types/community';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ThumbsUp, MessageSquare, Trash2 } from 'lucide-react';
import CategoryIcon, { formatCategoryName } from './CategoryIcon';

interface PostDetailProps {
  post: CommunityPost;
  isOwner: boolean;
  onLike: () => Promise<void>;
  onDelete: () => Promise<void>;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, isOwner, onLike, onDelete }) => {
  return (
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
              <CategoryIcon category={post.category} />
              <span className="text-xs text-white/70">{formatCategoryName(post.category)}</span>
            </div>
            
            {isOwner && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                onClick={onDelete}
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
            onClick={onLike}
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
  );
};

export default PostDetail;
