
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import PostDetail from './PostDetail';
import CommentsList from './CommentsList';
import CommentForm from './CommentForm';
import CommunityNav from './CommunityNav';
import GlassHeader from '@/components/GlassHeader';

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Comunidade", href: "/community" },
  { label: "Loja", href: "/store" },
  { label: "Bookings", href: "/bookings" },
  { label: "Demo", href: "/submit-demo" },
  { label: "Transmissão", href: "/live" },
  { label: "Press Kit", href: "/press-kit" },
  { label: "Airdrop", href: "/airdrop" }
];

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950">
      <GlassHeader menuItems={menuItems} />
      
      <div className="pt-16">
        <CommunityNav />
        
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            className="mb-6 text-white/80 hover:text-white"
            onClick={() => navigate('/community')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para Comunidade
          </Button>
          
          <div className="space-y-8">
            <PostDetail postId={postId || ''} />
            
            <div className="bg-black/30 backdrop-blur-md rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold text-white mb-4">Comentários</h3>
              <CommentsList postId={postId || ''} />
              <div className="mt-6">
                <CommentForm postId={postId || ''} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
