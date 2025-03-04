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

  // Função separada para filtragem por termo de busca
  const filterBySearch = (products: Product[], searchTerm: string): Product[] => {
    if (searchTerm.trim() === '') {
      return [...products];
    }
    
    const searchLower = searchTerm.toLowerCase().trim();
    return products.filter(product => 
      product.title.toLowerCase().includes(searchLower) || 
      (product.description && product.description.toLowerCase().includes(searchLower))
    );
  };

  // Função separada para ordenação
  const sortProducts = (products: Product[], sortMethod: string): Product[] => {
    const sorted = [...products];
    
    switch (sortMethod) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-az':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'name-za':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted; // 'newest' é o padrão, já ordenado na query
    }
  };

  // Função para aplicar limite (se necessário)
  const applyLimit = (products: Product[], limit?: number): Product[] => {
    if (limit && products.length > limit) {
      return products.slice(0, limit);
    }
    return products;
  };

  // Efeito para processar os produtos quando os filtros ou produtos mudam
  useEffect(() => {
    const filtered = filterBySearch(products, search);
    const sorted = sortProducts(filtered, sortBy);
    const limited = applyLimit(sorted, limit);
    
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
