
import React from 'react';
import { Link } from 'react-router-dom';
import { Diamond, Globe, Github, Twitter, Instagram, Lock } from 'lucide-react';
import { useAuth } from '../contexts/auth';

const Footer: React.FC = () => {
  const { userData } = useAuth();
  
  React.useEffect(() => {
    if (userData?.email === 'lucas@martynlegrand.com') {
      console.log('Admin user detected');
    }
  }, [userData]);
  
  return (
    <footer className="bg-black relative overflow-hidden">
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
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Cookies</a>
            
            <Link to="/admin" className="text-zinc-400/50 hover:text-white/60 transition-colors flex items-center">
              <Lock className="h-3 w-3 mr-1 opacity-50" />
              <span className="text-[10px]">Admin</span>
            </Link>
          </div>
        </div>
      </div>
      
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
