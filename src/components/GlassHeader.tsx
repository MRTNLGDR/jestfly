
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CyberMenu from './CyberMenu';
import JestCoinTicker from './JestCoinTicker';
import { MenuItems } from '../constants/menuItems';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/auth/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useMediaQuery } from '@/hooks/use-mobile';
import WalletWidget from './jestcoin/WalletWidget';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Users, Music, Headphones } from 'lucide-react';

const GlassHeader = () => {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when location changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">JESTFLY</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {MenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm ${
                  location.pathname === item.path
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side: JestCoin, Auth */}
          <div className="flex items-center space-x-4">
            {/* JestCoin Ticker (Desktop) */}
            {!isMobile && <JestCoinTicker compact />}
            
            {/* Wallet Widget (when logged in) */}
            {user && profile && <WalletWidget />}
            
            {/* Authentication */}
            {user && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile.avatar || undefined} alt={profile.display_name} />
                      <AvatarFallback className="bg-purple-800 text-xs">
                        {profile.display_name?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-black/90 border-purple-500/30 text-white">
                  <DropdownMenuLabel className="flex flex-col">
                    <span>{profile.display_name}</span>
                    <span className="text-xs text-gray-400">{profile.email}</span>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator className="bg-purple-500/20" />
                  
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Meu Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  {/* Admin Access */}
                  {profile.profile_type === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  {/* Artist Access */}
                  {profile.profile_type === 'artist' && (
                    <DropdownMenuItem asChild>
                      <Link to="/artist" className="cursor-pointer flex items-center">
                        <Music className="mr-2 h-4 w-4" />
                        <span>Área do Artista</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  {/* Collaborator Access */}
                  {profile.profile_type === 'collaborator' && (
                    <DropdownMenuItem asChild>
                      <Link to="/collaborator" className="cursor-pointer flex items-center">
                        <Headphones className="mr-2 h-4 w-4" />
                        <span>Área do Colaborador</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem asChild>
                    <Link to="/jestcoin" className="cursor-pointer flex items-center">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path d="M12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5Z" stroke="currentColor" strokeWidth="2" fill="none" />
                      </svg>
                      <span>JestCoin</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/community" className="cursor-pointer flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Comunidade</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-purple-500/20" />
                  
                  <DropdownMenuItem 
                    onClick={() => signOut()}
                    className="cursor-pointer text-red-400 hover:text-red-300 focus:text-red-300"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                  Entrar
                </Button>
              </Link>
            )}
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <CyberMenu isOpen={menuOpen} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-gradient-to-b from-black/80 to-purple-900/80 backdrop-blur-md z-40 p-4 pt-20">
          <nav className="flex flex-col space-y-2">
            {MenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-3 rounded-md text-white ${
                  location.pathname === item.path ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {!user && (
              <Link
                to="/auth"
                className="mt-4 px-4 py-3 rounded-md bg-purple-600 text-white text-center font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default GlassHeader;
