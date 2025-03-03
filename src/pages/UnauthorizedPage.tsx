
import React from 'react';
import GlassHeader from '../components/GlassHeader';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

// Menu items for consistent navigation
const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'NFTs', href: '/nfts' },
  { label: 'Events', href: '/events' },
  { label: 'Shop', href: '/shop' },
  { label: 'Community', href: '/community' },
];

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <GlassHeader menuItems={menuItems} />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-purple-950 px-4 py-20">
        <div className="max-w-md text-center">
          <h1 className="text-6xl font-bold text-white mb-4">401</h1>
          <h2 className="text-2xl font-semibold text-white mb-6">Unauthorized Access</h2>
          <p className="text-zinc-400 mb-8">
            You don't have permission to access this page. Please log in with an account that has the required permissions.
          </p>
          <div className="space-x-4">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-zinc-700 text-zinc-200 hover:bg-zinc-800"
            >
              Go Home
            </Button>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnauthorizedPage;
