
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

  // Process products when original array, search, or sort criteria change
  useEffect(() => {
    // Create a new copy to avoid modifying the original array
    let resultProducts = [...products];
    
    // Apply search filtering
    if (search.trim() !== '') {
      const searchLower = search.toLowerCase().trim();
      const searchResults: Product[] = [];
      
      // Using a for loop instead of filter to avoid potential type issues
      for (let i = 0; i < resultProducts.length; i++) {
        const product = resultProducts[i];
        const titleMatch = product.title.toLowerCase().includes(searchLower);
        const descriptionMatch = product.description ? 
          product.description.toLowerCase().includes(searchLower) : false;
        
        if (titleMatch || descriptionMatch) {
          searchResults.push(product);
        }
      }
      
      resultProducts = searchResults;
    }
    
    // Sort the filtered products
    resultProducts = sortProducts(resultProducts, sortBy);
    
    // Apply limit if specified
    if (limit && resultProducts.length > limit) {
      resultProducts = resultProducts.slice(0, limit);
    }
    
    setFilteredProducts(resultProducts);
  }, [products, search, sortBy, limit]);

  // Separate sorting function to simplify the main useEffect
  const sortProducts = (productsToSort: Product[], sortMethod: string): Product[] => {
    const sortedProducts = [...productsToSort];
    
    if (sortMethod === 'price-low') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortMethod === 'price-high') {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortMethod === 'name-az') {
      sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortMethod === 'name-za') {
      sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
    }
    // 'newest' is default - already sorted in query
    
    return sortedProducts;
  };

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
