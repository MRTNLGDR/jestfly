
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCommunityPosts } from '@/hooks/community';
import { useAuth } from '@/hooks/auth/useAuth';
import PostCard from './PostCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Filter, 
  AlertCircle, 
  Calendar, 
  MessageSquare, 
  Users, 
  Loader2 
} from 'lucide-react';

const CommunityHome: React.FC = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { posts, isLoading, error, likePost } = useCommunityPosts(activeCategory !== 'all' ? activeCategory : undefined);

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
      
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-black/40 backdrop-blur-md">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="announcement">Anúncios</TabsTrigger>
          <TabsTrigger value="event">Eventos</TabsTrigger>
          <TabsTrigger value="discussion">Discussões</TabsTrigger>
          <TabsTrigger value="collaboration">Colaborações</TabsTrigger>
          <TabsTrigger value="question">Perguntas</TabsTrigger>
        </TabsList>
      </Tabs>

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
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">Destacados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredPosts.map(post => (
                  <PostCard key={post.id} post={post} handleLikePost={handleLikePost} />
                ))}
              </div>
            </div>
          )}

          {normalPosts.length === 0 ? (
            <div className="text-center p-8 bg-black/20 rounded-lg">
              <p className="text-white/60">Nenhuma publicação encontrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {normalPosts.map(post => (
                <PostCard key={post.id} post={post} handleLikePost={handleLikePost} />
              ))}
            </div>
          )}
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
