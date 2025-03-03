import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCommunityPosts } from '@/hooks/community';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, MessageSquare } from 'lucide-react';
import CategoryTabs from './CategoryTabs';
import PostsList from './PostsList';

const CommunityHome: React.FC = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { 
    posts, 
    isLoading, 
    error, 
    likePost 
  } = useCommunityPosts(activeCategory !== 'all' ? activeCategory : undefined);

  const handleLikePost = async (postId: string) => {
    if (!user) {
      return;
    }
    
    try {
      await likePost.mutateAsync(postId);
    } catch (error) {
      console.error('Erro ao curtir post:', error);
    }
  };

  const featuredPosts = posts.filter(post => post.is_featured);
  const normalPosts = posts.filter(post => !post.is_featured);

  return (
    <div className="pt-24 px-6">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">JESTFLY Community</h1>
      
      <CategoryTabs 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-red-900/20 rounded-lg">
          <p className="text-red-400">Erro ao carregar posts da comunidade</p>
        </div>
      ) : (
        <div className="space-y-8">
          {featuredPosts.length > 0 && (
            <PostsList 
              title="Destacados"
              posts={featuredPosts}
              onLike={handleLikePost}
              layout="grid"
            />
          )}

          <PostsList 
            title="Todas as publicações"
            posts={normalPosts}
            onLike={handleLikePost}
          />
        </div>
      )}
      
      {user && (
        <Link to="/community/new-post" className="fixed bottom-24 right-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full p-4 shadow-lg">
          <MessageSquare className="h-6 w-6" />
        </Link>
      )}
    </div>
  );
};

export default CommunityHome;
