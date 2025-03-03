
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PenLine } from 'lucide-react';
import PostsList from './PostsList';
import CommunityNav from './CommunityNav';
import GlassHeader from '@/components/GlassHeader';
import { mainMenuItems } from '@/constants/menuItems';

const CommunityHome: React.FC = () => {
  const navigate = useNavigate();

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
          
          <PostsList />
        </div>
      </div>
    </div>
  );
};

export default CommunityHome;
