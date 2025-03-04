
import React, { useState, useEffect } from 'react';
import { Music, Package, Diamond, Sparkles, ShoppingCart, ArrowRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { Product } from './store/ProductCard';

interface ShopCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  type: 'nft' | 'music' | 'merch' | 'collectible';
}

const ShopPreview: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categories: ShopCategory[] = [
    {
      id: 'cat1',
      name: 'NFTs',
      type: 'nft',
      description: 'Limited edition digital collectibles with blockchain verification.',
      icon: <Diamond className="h-6 w-6" />,
      color: 'from-purple-600 to-purple-900'
    },
    {
      id: 'cat2',
      name: 'Music',
      type: 'music',
      description: 'Exclusive tracks, albums and unreleased content from JESTFLY.',
      icon: <Music className="h-6 w-6" />,
      color: 'from-blue-600 to-blue-900'
    },
    {
      id: 'cat3',
      name: 'Merchandise',
      type: 'merch',
      description: 'Official branded clothing and accessories from the collection.',
      icon: <Package className="h-6 w-6" />,
      color: 'from-cyan-600 to-cyan-900'
    },
    {
      id: 'cat4',
      name: 'Collectibles',
      type: 'collectible',
      description: 'Rare physical items and limited edition memorabilia.',
      icon: <Sparkles className="h-6 w-6" />,
      color: 'from-pink-600 to-pink-900'
    }
  ];

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (error) {
        throw error;
      }
      
      setFeaturedProducts(data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToCategory = (type: string) => {
    navigate(`/store/${type}s`);
  };

  return (
    <section className="w-full py-20 relative overflow-hidden bg-black">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, white 2px, transparent 0)', backgroundSize: '50px 50px' }}>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 tracking-tighter">
              EXPLORE <span className="text-gradient-primary">SHOP</span>
            </h2>
            <p className="text-white/70 max-w-md">
              Discover our unique collection of digital and physical products.
            </p>
          </div>
          
          <div className="mt-6 md:mt-0">
            <Button 
              className="group flex items-center space-x-2 px-5 py-2.5 rounded-full border border-white/30 text-white bg-black/40 hover:bg-black/60 transition-colors"
              onClick={() => navigate('/store')}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium uppercase">Browse All</span>
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-black font-bold text-xs">→</span>
              </div>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="neo-blur overflow-hidden rounded-lg border-white/10 hover:border-white/20 transition-all h-full group cursor-pointer"
              onClick={() => navigateToCategory(category.type)}
            >
              <CardContent className="p-6 flex flex-col h-full">
                {/* Icon with gradient background */}
                <div className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${category.color} group-hover:scale-105 transition-transform`}>
                  {category.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-3">{category.name}</h3>
                
                <p className="text-white/60 text-sm mb-6 flex-grow">
                  {category.description}
                </p>
                
                <div className="flex justify-between items-center mt-auto">
                  <div className="text-xs text-white/50 uppercase tracking-wider">
                    Browse Items
                  </div>
                  
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <span className="text-white/80 font-bold text-xs">→</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold">Featured Products</h3>
              <Button 
                variant="ghost" 
                className="text-white/70 hover:text-white"
                onClick={() => navigate('/store')}
              >
                See All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => {
                const getGradient = (type: string) => {
                  switch (type) {
                    case 'nft': return 'from-purple-700 to-purple-900';
                    case 'music': return 'from-blue-700 to-blue-900';
                    case 'merch': return 'from-red-700 to-orange-900';
                    case 'collectible': return 'from-green-700 to-emerald-900';
                    default: return 'from-gray-700 to-gray-900';
                  }
                };

                return (
                  <Card 
                    key={product.id} 
                    className="overflow-hidden border-white/10 hover:border-white/20 transition-all cursor-pointer group"
                    onClick={() => navigate(`/store/product/${product.id}`)}
                  >
                    <div className={`aspect-square bg-gradient-to-br ${getGradient(product.type)} flex items-center justify-center`}>
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-6xl">
                          {product.type === 'nft' ? '💎' : 
                          product.type === 'music' ? '🎵' : 
                          product.type === 'merch' ? '👕' : '🎁'}
                        </span>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="mb-1">
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-white/10 text-white/80">
                          {product.type}
                        </span>
                      </div>
                      <h3 className="font-medium truncate">{product.title}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-mono">${product.price.toFixed(2)}</span>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 rounded-full hover:bg-white/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopPreview;
