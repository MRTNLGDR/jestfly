import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCommunityPosts } from '@/hooks/useCommunity';
import { useAuth } from '@/hooks/auth/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MessageSquare, ThumbsUp, Calendar, AlertCircle, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
                  <Card key={post.id} className="bg-black/40 backdrop-blur-md border-white/10 hover:border-purple-500 transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(post.category)}
                          <span className="text-sm text-white/70">{formatCategoryName(post.category)}</span>
                        </div>
                        {post.is_pinned && (
                          <div className="bg-yellow-900/60 text-yellow-200 px-2 py-0.5 rounded-full text-xs">
                            Fixado
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-xl text-white">{post.title}</CardTitle>
                      <CardDescription className="text-white/60">
                        Por {post.user?.display_name || 'Usuário'} • {formatDistanceToNow(new Date(post.created_at), { locale: ptBR, addSuffix: true })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/80 line-clamp-3">{post.content}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2 border-t border-white/10">
                      <div className="flex space-x-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-white/70 hover:text-white hover:bg-white/10"
                          onClick={() => handleLikePost(post.id)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span>{post.likes_count}</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-white/70 hover:text-white hover:bg-white/10"
                          asChild
                        >
                          <Link to={`/community/post/${post.id}`}>
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span>{post.comments_count}</span>
                          </Link>
                        </Button>
                      </div>
                      <Button 
                        variant="ghost" 
                        className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                        asChild
                      >
                        <Link to={`/community/post/${post.id}`}>Ver mais</Link>
                      </Button>
                    </CardFooter>
                  </Card>
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
                <Card key={post.id} className="bg-black/40 backdrop-blur-md border-white/10 hover:border-purple-500 transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(post.category)}
                        <span className="text-sm text-white/70">{formatCategoryName(post.category)}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl text-white">{post.title}</CardTitle>
                    <CardDescription className="text-white/60">
                      Por {post.user?.display_name || 'Usuário'} • {formatDistanceToNow(new Date(post.created_at), { locale: ptBR, addSuffix: true })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80 line-clamp-3">{post.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t border-white/10">
                    <div className="flex space-x-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-white/70 hover:text-white hover:bg-white/10"
                        onClick={() => handleLikePost(post.id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>{post.likes_count}</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-white/70 hover:text-white hover:bg-white/10"
                        asChild
                      >
                        <Link to={`/community/post/${post.id}`}>
                          <MessageSquare className="h-4 w-4 mr-1" />
                          <span>{post.comments_count}</span>
                        </Link>
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                      asChild
                    >
                      <Link to={`/community/post/${post.id}`}>Ver mais</Link>
                    </Button>
                  </CardFooter>
                </Card>
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
