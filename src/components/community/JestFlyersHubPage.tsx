import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { Post } from '../../models/Post';
import { fetchPosts } from '../../services/feedService';
import { useAuth } from '../../contexts/auth';
import { toast } from 'sonner';
import CommunityNav from './CommunityNav';
import PostCard from './PostCard';
import CommentsList from './CommentsList';
import CreatePostModal from './CreatePostModal';
import { supabase } from '../../integrations/supabase/client';

const JestFlyersHubPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadPosts();
    
    // Configurar realtime (opcional para essa implementação)
    const channel = supabase
      .channel('public:community_posts')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'community_posts' }, 
        handleNewPost
      )
      .subscribe();
      
    return () => { channel.unsubscribe() };
  }, []);
  
  const handleNewPost = (payload: any) => {
    // Implementação básica para atualizar a lista quando um novo post é criado
    // Em uma implementação completa, você buscaria os dados do autor também
    toast.info('Novo post publicado!');
    loadPosts();
  };

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const postsData = await fetchPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentClick = (postId: string) => {
    setSelectedPostId(postId);
  };

  const handleCloseComments = () => {
    setSelectedPostId(null);
  };

  const handleCreatePost = () => {
    if (!currentUser) {
      toast.error('Você precisa estar logado para criar um post');
      return;
    }
    setShowCreateModal(true);
  };

  const handlePostCreated = () => {
    loadPosts();
  };

  return (
    <div className="bg-gradient-to-b from-black to-purple-950 min-h-screen pt-20">
      <CommunityNav />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              JestFlyers Hub
            </h1>
            <p className="text-white/70">Conecte-se com a comunidade e veja o que está acontecendo.</p>
          </div>
          
          <Button 
            onClick={handleCreatePost} 
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Criar Post
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-12 w-12 border-4 border-t-purple-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="neo-blur rounded-xl p-8 text-center border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum post ainda</h3>
            <p className="text-white/70 mb-4">Seja o primeiro a compartilhar algo com a comunidade!</p>
            <Button
              onClick={handleCreatePost}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar Post
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onCommentClick={handleCommentClick}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Modal de comentários */}
      {selectedPostId && (
        <CommentsList 
          postId={selectedPostId} 
          onClose={handleCloseComments}
        />
      )}
      
      {/* Modal de criação de post */}
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
};

export default JestFlyersHubPage;
