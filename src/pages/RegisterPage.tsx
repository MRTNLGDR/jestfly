
import React from 'react';
import GlassHeader from '../components/GlassHeader';
import { RegisterForm } from '../components/auth/register';

// Menu items for consistent navigation
const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'NFTs', href: '/nfts' },
  { label: 'Events', href: '/events' },
  { label: 'Shop', href: '/shop' },
  { label: 'Community', href: '/community' },
];

const RegisterPage: React.FC = () => {
  return (
    <>
      <GlassHeader menuItems={menuItems} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-purple-950 px-4 py-20">
        <RegisterForm />
      </div>
    </>
  );
};

export default RegisterPage;
