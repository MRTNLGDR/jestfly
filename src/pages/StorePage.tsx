
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProductCatalog } from '@/components/store/ProductCatalog';
import { Product, mapDbProductToProduct } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

const StorePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error);
          toast({
            title: 'Error',
            description: 'Failed to load products. Please try again later.',
            variant: 'destructive',
          });
          return;
        }

        if (data) {
          // Convert database products to our Product type
          const mappedProducts = data.map(mapDbProductToProduct);
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const handleAddToCart = (product: Product) => {
    toast({
      title: 'Added to cart',
      description: `${product.name || product.title} has been added to your cart.`,
    });
    // Implement actual cart functionality here
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-display-md md:text-display-lg mb-2 text-gradient-primary">
          JestFly Store
        </h1>
        <p className="text-body-lg text-white/70 max-w-3xl">
          Discover exclusive NFTs, music releases, and limited-edition merchandise from your favorite artists.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[500px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : (
        <ProductCatalog 
          products={products}
          onAddToCart={handleAddToCart}
          showFilters={true}
          showAddToCart={true}
        />
      )}
    </div>
  );
};

export default StorePage;
