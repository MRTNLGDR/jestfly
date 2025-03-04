
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ProductCard, { Product } from './ProductCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';

interface ProductCatalogProps {
  category?: 'nft' | 'music' | 'merch' | 'collectible';
  featuredOnly?: boolean;
  limit?: number;
}

// Helper function to handle product sorting without complex type inference
const sortProducts = (products: Product[], sortBy: string): Product[] => {
  const productsCopy = [...products]; // Create a copy to avoid mutations
  
  switch (sortBy) {
    case 'price-low':
      return productsCopy.sort((a, b) => {
        const priceA = Number(a.price);
        const priceB = Number(b.price);
        return priceA - priceB;
      });
    case 'price-high':
      return productsCopy.sort((a, b) => {
        const priceA = Number(a.price);
        const priceB = Number(b.price);
        return priceB - priceA;
      });
    case 'name-az':
      return productsCopy.sort((a, b) => a.title.localeCompare(b.title));
    case 'name-za':
      return productsCopy.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return productsCopy; // 'newest' or any other value
  }
};

const ProductCatalog: React.FC<ProductCatalogProps> = ({ 
  category, 
  featuredOnly = false,
  limit
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, [category, featuredOnly]);

  useEffect(() => {
    // Apply search filter
    let filtered: Product[] = [];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = products.filter(product => 
        product.title.toLowerCase().includes(searchLower) || 
        (product.description && product.description.toLowerCase().includes(searchLower))
      );
    } else {
      filtered = [...products];
    }
    
    // Apply sorting
    const sorted = sortProducts(filtered, sortBy);
    
    // Apply limit if provided
    const limited = limit ? sorted.slice(0, limit) : sorted;
    
    // Update state
    setFilteredProducts(limited);
  }, [products, search, sortBy, limit]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase.from('products').select('*');
      
      if (category) {
        query = query.eq('type', category);
      }
      
      if (featuredOnly) {
        query = query.eq('is_featured', true);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!featuredOnly && (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-black/30 border-white/10 text-white"
            />
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48 bg-black/30 border-white/10 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-black/80 border-white/10 text-white">
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name-az">Name: A to Z</SelectItem>
              <SelectItem value="name-za">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="aspect-square rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductCatalog;
