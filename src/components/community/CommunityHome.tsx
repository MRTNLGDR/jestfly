
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PenLine } from 'lucide-react';
import PostsList from './PostsList';
import CommunityNav from './CommunityNav';
import GlassHeader from '@/components/GlassHeader';
import { mainMenuItems } from '@/constants/menuItems';
import { Post } from '@/types/community';
import { supabase } from '@/integrations/supabase/client';

const CommunityHome: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('community_posts')
          .select('*, profiles(username, avatar)')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setPosts(data as unknown as Post[]);
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLikePost = async (postId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        navigate('/auth');
        return;
      }

      // Toggle like logic would go here
      console.log('Like post:', postId);
    } catch (error) {
      console.error('Erro ao curtir post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950">
      <GlassHeader menuItems={mainMenuItems} />
      
      <div className="pt-16"> {/* Adicionado padding-top para compensar o header fixo */}
        <CommunityNav />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Comunidade JESTFLY
            </h1>
            
            <Button 
              onClick={() => navigate('/community/new-post')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <PenLine className="mr-2 h-4 w-4" />
              Nova Publicação
            </Button>
          </div>
          
          <PostsList
            title="Publicações Recentes"
            posts={posts}
            onLike={handleLikePost}
            emptyMessage="Nenhuma publicação encontrada. Seja o primeiro a publicar!"
          />
        </div>
      </div>
    </div>
  );
};

export default CommunityHome;
