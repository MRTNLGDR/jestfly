
import React from 'react';
import { useParams } from 'react-router-dom';
import PostDetail from './PostDetail';
import { usePostDetail } from '@/hooks/community/usePostDetail';
import BackToCommunity from './BackToCommunity';
import PostLoading from './PostLoading';
import PostNotFound from './PostNotFound';
import PostComments from './PostComments';

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const {
    post,
    comments,
    isLoading,
    isCommentLoading,
    currentUserId,
    handleLikePost,
    handleDeletePost,
    handleLikeComment,
    handleDeleteComment,
    handleSubmitComment
  } = usePostDetail(postId);
  
  return (
    <>
      <BackToCommunity />
      
      {isLoading ? (
        <PostLoading />
      ) : post ? (
        <div className="space-y-8">
          <PostDetail 
            post={post} 
            isOwner={currentUserId === post.user_id}
            onLike={handleLikePost}
            onDelete={handleDeletePost}
          />
          
          <PostComments
            comments={comments}
            isLoading={isCommentLoading}
            currentUserId={currentUserId}
            onLikeComment={handleLikeComment}
            onDeleteComment={handleDeleteComment}
            onSubmitComment={handleSubmitComment}
          />
        </div>
      ) : (
        <PostNotFound />
      )}
    </>
  );
};

export default PostDetailPage;
