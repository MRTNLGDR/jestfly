
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, Menu, X } from 'lucide-react';

interface MenuItem {
  label: string;
  href: string;
}

interface GlassHeaderProps {
  menuItems: MenuItem[];
}

const GlassHeader: React.FC<GlassHeaderProps> = ({ menuItems }) => {
  const { t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fechar o menu quando a rota mudar
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleNavigate = (href: string) => {
    navigate(href);
    setIsMenuOpen(false);
  };

  // Verifica se o link está ativo
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white font-bold text-xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                JESTFLY
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href) 
                      ? 'text-white bg-purple-800/50' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Menu */}
          <div className="flex items-center">
            {user && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile.avatar || undefined} alt={profile.display_name} />
                      <AvatarFallback className="bg-purple-900 text-white">
                        {profile.display_name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-black/90 backdrop-blur-md border-white/10 text-white z-[100]">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="font-medium">{profile.display_name}</p>
                    <p className="text-xs text-white/60 truncate">{profile.email}</p>
                    <p className="text-xs text-purple-400 capitalize">{profile.profile_type}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
                    onClick={() => navigate('/profile')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
                    onClick={() => navigate('/profile?tab=settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-400 hover:bg-red-900/20 focus:bg-red-900/20"
                    onClick={signOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={() => navigate('/auth')}
              >
                Login
              </Button>
            )}

            {/* Mobile menu button */}
            <div className="ml-4 md:hidden">
              <button
                className="text-white hover:text-white focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-b border-white/10 absolute w-full z-40">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <button
                key={item.href}
                className={`w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.href)
                    ? 'text-white bg-purple-800/50'
                    : 'text-white/80 hover:bg-white/10'
                }`}
                onClick={() => handleNavigate(item.href)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default GlassHeader;
