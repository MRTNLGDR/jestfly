
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import ProductCatalog from '../components/store/ProductCatalog';
import GlassHeader from '../components/GlassHeader';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

// Store landing page
const StoreHome = () => {
  const { openCart, itemCount } = useCart();
  
  const categoryCards = [
    {
      type: 'nft' as const,
      title: 'NFTs',
      gradient: 'from-purple-900 to-blue-900',
      action: 'Explore',
      icon: '💎'
    },
    {
      type: 'music' as const,
      title: 'Music',
      gradient: 'from-blue-900 to-cyan-900',
      action: 'Listen',
      icon: '🎵'
    },
    {
      type: 'merch' as const,
      title: 'Merch',
      gradient: 'from-red-900 to-orange-900',
      action: 'Shop',
      icon: '👕'
    },
    {
      type: 'collectible' as const,
      title: 'Collectibles',
      gradient: 'from-green-900 to-emerald-900',
      action: 'Collect',
      icon: '🎁'
    }
  ];

  return (
    <div className="container mx-auto pb-20">
      <div className="pt-24 px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white">JESTFLY Store</h1>
          
          <Button 
            variant="outline" 
            className="border-white/10 text-white hover:bg-white/10 flex items-center gap-2"
            onClick={openCart}
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Cart</span>
            {itemCount > 0 && (
              <span className="ml-1 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {categoryCards.map((card) => (
            <Link to={`/store/${card.type}s`} key={card.type} className="block group">
              <div className={`aspect-video bg-gradient-to-br ${card.gradient} rounded-lg flex items-center justify-center relative overflow-hidden border border-white/10 group-hover:border-${card.type === 'nft' ? 'purple' : card.type === 'music' ? 'blue' : card.type === 'merch' ? 'red' : 'green'}-500 transition-all`}>
                <div className="flex items-center gap-4">
                  <span className="text-6xl">{card.icon}</span>
                  <h2 className="text-4xl font-bold text-white">{card.title}</h2>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-white/20 px-4 py-2 rounded-full text-white backdrop-blur-md">
                    {card.action} →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <h2 className="text-2xl font-bold mb-8">Featured Products</h2>
        <ProductCatalog featuredOnly={true} limit={8} />
      </div>
    </div>
  );
};

// Category-specific pages
const CategoryPage = ({ category }: { category: 'nft' | 'music' | 'merch' | 'collectible' }) => {
  const { openCart, itemCount } = useCart();
  
  const getCategoryTitle = () => {
    switch (category) {
      case 'nft': return 'NFT Collection';
      case 'music': return 'Music';
      case 'merch': return 'Merchandise';
      case 'collectible': return 'Collectibles';
    }
  };
  
  const getCategoryGradient = () => {
    switch (category) {
      case 'nft': return 'from-black to-purple-900';
      case 'music': return 'from-black to-blue-900';
      case 'merch': return 'from-black to-red-900';
      case 'collectible': return 'from-black to-green-900';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${getCategoryGradient()} pt-24 px-6`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white">{getCategoryTitle()}</h1>
        
        <Button 
          variant="outline" 
          className="border-white/10 text-white hover:bg-white/10 flex items-center gap-2"
          onClick={openCart}
        >
          <ShoppingCart className="h-5 w-5" />
          <span>Cart</span>
          {itemCount > 0 && (
            <span className="ml-1 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {itemCount}
            </span>
          )}
        </Button>
      </div>
      
      <ProductCatalog category={category} />
    </div>
  );
};

const StorePage: React.FC = () => {
  const location = useLocation();
  const { openCart, itemCount } = useCart();
  
  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Store", href: "/store" },
    { label: "NFTs", href: "/store/nfts" },
    { label: "Music", href: "/store/music" },
    { label: "Merch", href: "/store/merch" },
    { label: "Collectibles", href: "/store/collectibles" }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <GlassHeader menuItems={menuItems} />
      
      {/* Store Nav */}
      <div className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-20 z-10">
        <div className="container mx-auto flex justify-between items-center overflow-x-auto whitespace-nowrap py-4 px-6">
          <div className="flex">
            <Link to="/store" className={`px-4 py-2 mr-4 transition-colors ${location.pathname === '/store' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
              All Products
            </Link>
            <Link to="/store/nfts" className={`px-4 py-2 mr-4 transition-colors ${location.pathname === '/store/nfts' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
              NFTs
            </Link>
            <Link to="/store/music" className={`px-4 py-2 mr-4 transition-colors ${location.pathname === '/store/music' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
              Music
            </Link>
            <Link to="/store/merch" className={`px-4 py-2 mr-4 transition-colors ${location.pathname === '/store/merch' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
              Merch
            </Link>
            <Link to="/store/collectibles" className={`px-4 py-2 transition-colors ${location.pathname === '/store/collectibles' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
              Collectibles
            </Link>
          </div>
          
          <Button 
            variant="outline" 
            className="border-white/10 text-white hover:bg-white/10 flex items-center gap-2 ml-4"
            onClick={openCart}
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
      
      <Routes>
        <Route path="/" element={<StoreHome />} />
        <Route path="/nfts" element={<CategoryPage category="nft" />} />
        <Route path="/music" element={<CategoryPage category="music" />} />
        <Route path="/merch" element={<CategoryPage category="merch" />} />
        <Route path="/collectibles" element={<CategoryPage category="collectible" />} />
      </Routes>
      
      <Footer />
    </div>
  );
};

export default StorePage;
