
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCommunityPosts, usePostComments } from '@/hooks/useCommunity';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { CommunityPost } from '@/types/community';
import PostDetail from './PostDetail';
import CommentForm from './CommentForm';
import CommentsList from './CommentsList';

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { comments, isLoading: commentsLoading, createComment, deleteComment, likeComment } = usePostComments(postId || '');
  const { likePost, deletePost } = useCommunityPosts();
  
  // Fetch post details
  const fetchPostDetails = async (): Promise<CommunityPost> => {
    if (!postId) throw new Error('Post ID não fornecido');

    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        user:profiles(username, display_name, avatar)
      `)
      .eq('id', postId)
      .single();

    if (error) {
      console.error('Error fetching post details:', error);
      throw new Error(error.message);
    }

    return data as unknown as CommunityPost;
  };

  const {
    data: post,
    isLoading: postLoading,
    error: postError
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: fetchPostDetails,
    enabled: !!postId
  });

  // Handler functions
  const handleCreateComment = async (content: string) => {
    try {
      await createComment.mutateAsync(content);
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleDeletePost = async () => {
    if (!post || !user || user.id !== post.user_id) return;
    
    try {
      await deletePost.mutateAsync(post.id);
      navigate('/community');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLikePost = async () => {
    if (!post) return;
    try {
      await likePost.mutateAsync(post.id);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment.mutateAsync(commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      await likeComment.mutateAsync(commentId);
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  // Loading state
  if (postLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  // Error state
  if (postError || !post) {
    return (
      <div className="max-w-4xl mx-auto pt-24 px-6">
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="bg-red-900/20 p-8 rounded-lg text-center">
          <p className="text-red-400">Post não encontrado ou erro ao carregar detalhes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-24 px-6 pb-24">
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para a Comunidade
      </Button>
      
      {/* Post Details */}
      <PostDetail 
        post={post} 
        isOwner={user?.id === post.user_id}
        onLike={handleLikePost}
        onDelete={handleDeletePost}
      />
      
      {/* Comments Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Comentários</h2>
        
        {/* Comment Form */}
        <CommentForm 
          isLoggedIn={!!user}
          onSubmit={handleCreateComment}
          isPending={createComment.isPending}
        />
        
        {/* Comments List */}
        <CommentsList 
          comments={comments}
          isLoading={commentsLoading}
          currentUserId={user?.id}
          onLikeComment={handleLikeComment}
          onDeleteComment={handleDeleteComment}
        />
      </div>
    </div>
  );
};

export default PostDetailPage;
