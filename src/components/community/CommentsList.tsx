
import React from 'react';
import { Comment } from '@/types/community';
import { Loader2 } from 'lucide-react';
import CommentCard from './CommentCard';

interface CommentsListProps {
  comments: Comment[];
  isLoading: boolean;
  currentUserId: string | undefined;
  onLikeComment: (commentId: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

const CommentsList: React.FC<CommentsListProps> = ({ 
  comments, 
  isLoading, 
  currentUserId,
  onLikeComment,
  onDeleteComment 
}) => {
  const isLoggedIn = !!currentUserId;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
      </div>
    );
  }
  
  if (comments.length === 0) {
    return (
      <div className="bg-black/20 p-6 rounded-lg text-center">
        <p className="text-white/60">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentCard 
          key={comment.id} 
          comment={comment} 
          isOwner={currentUserId === comment.user_id}
          isLoggedIn={isLoggedIn}
          onLike={() => onLikeComment(comment.id)}
          onDelete={() => onDeleteComment(comment.id)}
        />
      ))}
    </div>
  );
};

export default CommentsList;
