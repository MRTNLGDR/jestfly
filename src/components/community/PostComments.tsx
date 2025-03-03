
import React from 'react';
import { Comment } from '@/types/community';
import CommentsList from './CommentsList';
import CommentForm from './CommentForm';

interface PostCommentsProps {
  comments: Comment[];
  isLoading: boolean;
  currentUserId?: string;
  onLikeComment: (commentId: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onSubmitComment: (content: string) => Promise<void>;
}

const PostComments: React.FC<PostCommentsProps> = ({
  comments,
  isLoading,
  currentUserId,
  onLikeComment,
  onDeleteComment,
  onSubmitComment
}) => {
  return (
    <div className="bg-black/30 backdrop-blur-md rounded-lg p-6 border border-purple-500/20">
      <h3 className="text-xl font-bold text-white mb-4">Comentários</h3>
      <CommentsList 
        comments={comments}
        isLoading={isLoading}
        currentUserId={currentUserId}
        onLikeComment={onLikeComment}
        onDeleteComment={onDeleteComment}
      />
      <div className="mt-6">
        <CommentForm 
          isLoggedIn={!!currentUserId}
          onSubmit={onSubmitComment}
          isPending={false}
        />
      </div>
    </div>
  );
};

export default PostComments;
