
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '../hooks/use-mobile';
import { Diamond, Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface MenuItem {
  label: string;
  href: string;
}

interface GlassHeaderProps {
  menuItems: MenuItem[];
}

const GlassHeader: React.FC<GlassHeaderProps> = ({ menuItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!profile?.display_name) return 'JF';
    return profile.display_name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Filter out admin route for non-admin users
  const filteredMenuItems = profile?.profile_type === 'admin'
    ? menuItems
    : menuItems.filter(item => item.href !== '/admin');

  return (
    <header
      className={`fixed z-50 top-0 left-0 right-0 transition-all duration-300 backdrop-blur-xl ${
        scrolled ? 'bg-black/70 border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 z-50 relative">
            <Diamond className="h-6 w-6 text-purple-400 glow-purple" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              JESTFLY
            </span>
          </Link>

          {/* Desktop Menu */}
          {!isMobile && (
            <nav className="hidden md:flex space-x-8">
              {filteredMenuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-purple-400 ${
                    location.pathname === item.href
                      ? 'text-purple-400'
                      : 'text-white/80'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Auth buttons or User profile */}
          <div className="flex items-center space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-white/20">
                      <AvatarImage src={profile?.avatar || undefined} alt={profile?.display_name || "User"} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 neo-blur border-white/10" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile?.display_name}</p>
                      <p className="text-xs leading-none text-white/70">{profile?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-400 focus:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Link to="/auth">
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </Link>
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <button
                onClick={toggleMenu}
                className="md:hidden z-50 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-white" />
                ) : (
                  <Menu className="h-6 w-6 text-white" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-40 backdrop-blur-xl bg-black/90 transform transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full pt-24 px-8 pb-8">
            <nav className="flex flex-col space-y-6">
              {filteredMenuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={`text-xl font-medium transition-colors hover:text-purple-400 ${
                    location.pathname === item.href
                      ? 'text-purple-400'
                      : 'text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto">
              {!user && (
                <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Link to="/auth">
                    <LogIn className="h-4 w-4 mr-2" />
                    Entrar
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default GlassHeader;
