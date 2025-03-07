
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define Product type
export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: 'nft' | 'music' | 'merch' | 'collectible';
  featured?: boolean;
  artist?: string;
  releaseDate?: string;
  type: string;
};

// Define props type with proper generic constraint
export interface ProductCatalogProps {
  category?: 'nft' | 'music' | 'merch' | 'collectible';
  featuredOnly?: boolean;
  limit?: number;
}

// Sort option type
type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'oldest';

// Define sort function type to avoid recursive type references
type SortFunction = (a: Product, b: Product) => number;

// Helper function to get sort function
const getSortFunction = (sortOption: SortOption): SortFunction => {
  switch (sortOption) {
    case 'price-asc':
      return (a, b) => a.price - b.price;
    case 'price-desc':
      return (a, b) => b.price - a.price;
    case 'newest':
      return (a, b) => {
        const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
        const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
        return dateB - dateA;
      };
    case 'oldest':
      return (a, b) => {
        const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
        const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
        return dateA - dateB;
      };
    default:
      return (a, b) => 0;
  }
};

// Sample products data
const sampleProducts: Product[] = [
  {
    id: '1',
    title: 'Digital Dream NFT',
    description: 'Limited edition digital artwork',
    price: 0.5,
    image: '/placeholder.svg',
    category: 'nft',
    featured: true,
    artist: 'Digital Artist',
    releaseDate: '2023-05-15',
    type: 'Digital Art'
  },
  {
    id: '2',
    title: 'Neon Nights EP',
    description: 'Latest electronic music release',
    price: 9.99,
    image: '/placeholder.svg',
    category: 'music',
    artist: 'Electronic Producer',
    releaseDate: '2023-06-20',
    type: 'Music'
  },
  {
    id: '3',
    title: 'JESTFLY T-Shirt',
    description: 'Premium cotton t-shirt with logo',
    price: 29.99,
    image: '/placeholder.svg',
    category: 'merch',
    type: 'Clothing'
  },
  {
    id: '4',
    title: 'Signed Vinyl Collection',
    description: 'Limited edition signed vinyl records',
    price: 149.99,
    image: '/placeholder.svg',
    category: 'collectible',
    featured: true,
    artist: 'Various Artists',
    type: 'Collectible'
  },
  {
    id: '5',
    title: 'Crystal Memories NFT',
    description: 'Exclusive crystal-themed digital collectible',
    price: 0.8,
    image: '/placeholder.svg',
    category: 'nft',
    artist: 'Crystal Artist',
    releaseDate: '2023-07-10',
    type: 'Digital Art'
  },
  {
    id: '6',
    title: 'JESTFLY Hoodie',
    description: 'Comfortable hoodie with glow-in-dark print',
    price: 59.99,
    image: '/placeholder.svg',
    category: 'merch',
    type: 'Clothing'
  }
];

const ProductCatalog: React.FC<ProductCatalogProps> = ({ 
  category, 
  featuredOnly = false,
  limit 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll use the sample data
        let filteredProducts = [...sampleProducts];
        
        // Apply category filter if specified
        if (category) {
          filteredProducts = filteredProducts.filter(p => p.category === category);
        }
        
        // Apply featured filter if specified
        if (featuredOnly) {
          filteredProducts = filteredProducts.filter(p => p.featured);
        }
        
        // Apply limit if specified
        if (limit && filteredProducts.length > limit) {
          filteredProducts = filteredProducts.slice(0, limit);
        }
        
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [category, featuredOnly, limit]);

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort(getSortFunction(sortOption));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-pulse-slow">Loading products...</div>
      </div>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-title-md">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or check back later for new items.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!featuredOnly && !limit && (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {limit && products.length >= limit && (
        <div className="mt-8 text-center">
          <Button variant="outline" className="hover-glow">View All Products</Button>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
