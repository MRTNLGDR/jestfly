
import React from 'react';
import { Diamond, Globe, Github, Twitter, Instagram, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { footerMenuItems } from '@/constants/menuItems';

const Footer: React.FC = () => {
  const navigate = useNavigate();

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
              {footerMenuItems.navigation.map((item, index) => (
                <FooterLink key={`nav-${index}`} href={item.href}>{item.label}</FooterLink>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-3">
              {footerMenuItems.resources.map((item, index) => (
                <FooterLink key={`resource-${index}`} href={item.href}>{item.label}</FooterLink>
              ))}
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
            <Link to="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
            <Link to="/cookies" className="hover:text-white/60 transition-colors">Cookies</Link>
            
            {/* Botão de acesso admin com aparência mais profissional */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/admin/login')}
              className="ml-2 text-xs bg-gray-900/30 hover:bg-gray-900/50 border-gray-700/50 text-white/70 flex items-center gap-1 h-7 px-2"
            >
              <Lock className="h-3 w-3 opacity-70" />
              <span>Admin</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
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
