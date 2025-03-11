
import React, { useState } from 'react';
import { 
  FooterBrand,
  FooterNavLinks,
  FooterContact,
  FooterBottom,
  AdminLoginDialog
} from './footer';

const Footer: React.FC = () => {
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);

  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/events', label: 'Events' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' }
  ];

  const resourceLinks = [
    { href: '/faq', label: 'FAQ' },
    { href: '/support', label: 'Support' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/community', label: 'Community' }
  ];

  return (
    <footer className="bg-black relative overflow-hidden">
      {/* Decorative top border */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <FooterBrand />
          <FooterNavLinks title="Navigation" links={navigationLinks} />
          <FooterNavLinks title="Resources" links={resourceLinks} />
          <FooterContact />
        </div>
        
        <FooterBottom onAdminDialogOpen={() => setIsAdminDialogOpen(true)} />
      </div>
      
      <AdminLoginDialog 
        isOpen={isAdminDialogOpen} 
        onOpenChange={setIsAdminDialogOpen} 
      />
      
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-900/10 rounded-full blur-[100px]"></div>
      <div className="absolute top-20 right-0 w-60 h-60 bg-blue-900/10 rounded-full blur-[100px]"></div>
    </footer>
  );
};

export default Footer;
