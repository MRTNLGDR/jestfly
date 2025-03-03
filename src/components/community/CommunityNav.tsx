
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Calendar, Gift, Users } from 'lucide-react';

const CommunityNav: React.FC = () => {
  const location = useLocation();
  
  // Verifica se o link está ativo com mais precisão
  const isActive = (path: string) => {
    if (path === '/community' && location.pathname === '/community') {
      return true;
    }
    return location.pathname === path || 
           (path !== '/community' && location.pathname.startsWith(path));
  };

  return (
    <div className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-16 z-30">
      <div className="container mx-auto overflow-x-auto scrollbar-none">
        <div className="flex whitespace-nowrap py-4 px-4 md:px-6">
          <Button
            variant={isActive('/community') ? "default" : "ghost"}
            className={`mr-2 ${isActive('/community') ? 'bg-purple-800' : 'text-white/80 hover:text-white'}`}
            asChild
          >
            <Link to="/community">
              <MessageSquare className="h-4 w-4 mr-2" />
              Comunidade
            </Link>
          </Button>
          
          <Button
            variant={isActive('/community/events') ? "default" : "ghost"}
            className={`mr-2 ${isActive('/community/events') ? 'bg-purple-800' : 'text-white/80 hover:text-white'}`}
            asChild
          >
            <Link to="/community/events">
              <Calendar className="h-4 w-4 mr-2" />
              Eventos
            </Link>
          </Button>
          
          <Button
            variant={isActive('/community/giveaways') ? "default" : "ghost"}
            className={`mr-2 ${isActive('/community/giveaways') ? 'bg-purple-800' : 'text-white/80 hover:text-white'}`}
            asChild
          >
            <Link to="/community/giveaways">
              <Gift className="h-4 w-4 mr-2" />
              Sorteios
            </Link>
          </Button>
          
          <Button
            variant={isActive('/community/hub') ? "default" : "ghost"}
            className={`${isActive('/community/hub') ? 'bg-purple-800' : 'text-white/80 hover:text-white'}`}
            asChild
          >
            <Link to="/community/hub">
              <Users className="h-4 w-4 mr-2" />
              JestFlyers Hub
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityNav;
