
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Product, ProductType, mapDbProductToProduct } from '@/types/product';
import { ProductCard } from '@/components/store/ProductCard';

export const ShopPreview: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ProductType | 'all'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(8)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error);
          return;
        }

        if (data) {
          // Convert database products to our Product type
          const mappedProducts = data.map(mapDbProductToProduct);
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => 
    activeTab === 'all' || product.type === activeTab
  );

  // Determine product tabs based on available product types
  const productTypes = Array.from(new Set(['all', ...products.map(p => p.type)]));

  const getTabLabel = (type: string) => {
    switch(type) {
      case 'all': return 'All';
      case 'nft': return 'NFTs';
      case 'music': return 'Music';
      case 'merch': return 'Merch';
      case 'collectible': return 'Collectibles';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="bg-black py-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10"></div>
      
      <div className="container mx-auto px-4 relative z-20">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-display-md md:text-display-lg mb-3 text-center text-gradient-primary">
            Featured Products
          </h2>
          <p className="text-center text-body-lg text-white/70 max-w-2xl">
            Discover exclusive NFTs, music releases, and limited-edition merchandise from your favorite artists.
          </p>
        </div>

        {/* Product Type Tabs */}
        <div className="flex justify-center mb-8 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex space-x-2">
            {productTypes.map((type) => (
              <Button
                key={type}
                variant={activeTab === type ? "default" : "ghost"}
                onClick={() => setActiveTab(type as ProductType | 'all')}
                className="whitespace-nowrap"
              >
                {getTabLabel(type)}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showAddToCart={false}
              />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-12">
          <Button 
            variant="glass" 
            size="lg" 
            onClick={() => navigate('/store')}
            className="px-8"
          >
            View All Products
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShopPreview;
