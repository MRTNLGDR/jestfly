
import React from 'react';
import { Comment } from '@/types/community';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ThumbsUp, Trash2 } from 'lucide-react';

interface CommentCardProps {
  comment: Comment;
  isOwner: boolean;
  onLike: () => Promise<void>;
  onDelete: () => Promise<void>;
  isLoggedIn: boolean;
}

const CommentCard: React.FC<CommentCardProps> = ({ 
  comment, 
  isOwner, 
  onLike, 
  onDelete,
  isLoggedIn
}) => {
  return (
    <Card className="bg-black/30 border-white/10">
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
          
          {isOwner && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 w-8 p-0"
              onClick={onDelete}
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
          onClick={onLike}
          disabled={!isLoggedIn}
        >
          <ThumbsUp className="h-4 w-4 mr-1" />
          <span>{comment.likes_count}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CommentCard;
