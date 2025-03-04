import React, { useState } from 'react';
import { Diamond, Globe, Github, Twitter, Instagram, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const Footer: React.FC = () => {
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const { signIn } = useAuth();
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (demoType: 'admin' | 'artist' | 'collaborator' | 'fan') => {
    setIsLoading(true);
    setLoginError('');
    
    const demoAccounts = {
      admin: { email: 'admin@jestfly.com', password: 'admin123' },
      artist: { email: 'artist@jestfly.com', password: 'artist123' },
      collaborator: { email: 'collaborator@jestfly.com', password: 'collab123' },
      fan: { email: 'fan@jestfly.com', password: 'fan123' }
    };
    
    try {
      const { email, password } = demoAccounts[demoType];
      const { error } = await signIn(email, password);
      
      if (error) {
        setLoginError(error.message);
      } else {
        setIsAdminDialogOpen(false);
      }
    } catch (error) {
      setLoginError('Falha ao realizar login. Tente novamente.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-black relative overflow-hidden">
      {/* Decorative top border */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center mb-6">
              <Diamond className="h-8 w-8 text-white glow-purple mr-2" />
              <span className="text-2xl font-bold tracking-tight">JESTFLY</span>
            </div>
            
            <p className="text-white/60 text-sm mb-6 max-w-xs">
              A digital platform merging music, art, and technology to create immersive entertainment experiences.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Globe className="h-5 w-5 text-white/80" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Twitter className="h-5 w-5 text-white/80" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Instagram className="h-5 w-5 text-white/80" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Github className="h-5 w-5 text-white/80" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Navigation</h3>
            <ul className="space-y-3">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/shop">Shop</FooterLink>
              <FooterLink href="/events">Events</FooterLink>
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-3">
              <FooterLink href="/faq">FAQ</FooterLink>
              <FooterLink href="/support">Support</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/community">Community</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            <ul className="space-y-3 text-white/60 text-sm">
              <li>Tokyo, Japan</li>
              <li>San Francisco, USA</li>
              <li>contact@jestfly.com</li>
              <li className="pt-4">
                <button className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm transition-colors">
                  Send Message
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="w-full h-px bg-white/10 my-10"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center text-white/40 text-xs">
          <div>© 2023 JESTFLY. All rights reserved.</div>
          
          <div className="flex space-x-6 mt-4 md:mt-0 items-center">
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Cookies</a>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAdminDialogOpen(true)}
              className="ml-2 text-xs bg-gray-900/30 hover:bg-gray-900/50 border-gray-700/50 text-white/70 flex items-center gap-1 h-7 px-2"
            >
              <Lock className="h-3 w-3 opacity-70" />
              <span>Admin</span>
            </Button>
          </div>
        </div>
      </div>
      
      <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
        <DialogContent className="bg-black/90 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-center mb-2">Acesso Rápido</DialogTitle>
            <DialogDescription className="text-center text-white/60">
              Selecione uma conta para login automático
            </DialogDescription>
          </DialogHeader>
          
          {loginError && (
            <div className="bg-red-900/30 border border-red-800/50 text-red-200 p-3 rounded-md text-sm mb-4">
              {loginError}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="bg-gray-900/20 hover:bg-gray-900/40 border-gray-700/50 text-white"
              onClick={() => handleAdminLogin('admin')}
              disabled={isLoading}
            >
              Admin
            </Button>
            <Button
              variant="outline"
              className="bg-gray-900/20 hover:bg-gray-900/40 border-gray-700/50 text-white"
              onClick={() => handleAdminLogin('artist')}
              disabled={isLoading}
            >
              Artista
            </Button>
            <Button
              variant="outline"
              className="bg-gray-900/20 hover:bg-gray-900/40 border-gray-700/50 text-white"
              onClick={() => handleAdminLogin('collaborator')}
              disabled={isLoading}
            >
              Colaborador
            </Button>
            <Button
              variant="outline"
              className="bg-gray-900/20 hover:bg-gray-900/40 border-gray-700/50 text-white"
              onClick={() => handleAdminLogin('fan')}
              disabled={isLoading}
            >
              Fã
            </Button>
          </div>
          
          <div className="mt-2 text-center text-xs text-white/40">
            Acesso temporário para fins de demonstração
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-900/10 rounded-full blur-[100px]"></div>
      <div className="absolute top-20 right-0 w-60 h-60 bg-blue-900/10 rounded-full blur-[100px]"></div>
    </footer>
  );
};

const FooterLink: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
  <li>
    <Link to={href} className="text-white/60 hover:text-white transition-colors text-sm">
      {children}
    </Link>
  </li>
);

export default Footer;
