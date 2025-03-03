
import React from 'react';
import { useParams } from 'react-router-dom';
import PostDetail from './PostDetail';
import CommunityNav from './CommunityNav';
import GlassHeader from '@/components/GlassHeader';
import { mainMenuItems } from '@/constants/menuItems';
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
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950">
      <GlassHeader menuItems={mainMenuItems} />
      
      <div className="pt-16">
        <CommunityNav />
        
        <div className="container mx-auto px-4 py-8">
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
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
