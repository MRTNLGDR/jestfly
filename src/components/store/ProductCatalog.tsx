
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

// Mock product data - in a real app, this would come from an API
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
};

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Crystal Headphones',
    description: 'Premium crystal-themed headphones with neon accents',
    price: 199.99,
    imageUrl: '/placeholder.svg',
    category: 'audio'
  },
  {
    id: '2',
    name: 'Neon T-Shirt',
    description: 'Glow in the dark JESTFLY branded t-shirt',
    price: 29.99,
    imageUrl: '/placeholder.svg',
    category: 'clothing'
  },
  {
    id: '3',
    name: 'Digital Sample Pack',
    description: 'Collection of exclusive JESTFLY audio samples',
    price: 49.99,
    imageUrl: '/placeholder.svg',
    category: 'digital'
  },
  {
    id: '4',
    name: 'LED Wristband',
    description: 'Interactive LED wristband for live events',
    price: 19.99,
    imageUrl: '/placeholder.svg',
    category: 'accessories'
  },
  {
    id: '5',
    name: 'Crystal USB Drive',
    description: '32GB crystal-shaped USB drive with exclusive content',
    price: 39.99,
    imageUrl: '/placeholder.svg',
    category: 'accessories'
  },
  {
    id: '6',
    name: 'Limited Edition Vinyl',
    description: 'Holographic vinyl record with exclusive tracks',
    price: 59.99,
    imageUrl: '/placeholder.svg',
    category: 'audio'
  }
];

const categories = ['all', 'audio', 'clothing', 'digital', 'accessories'];
const sortOptions = ['price-low', 'price-high', 'name-asc', 'name-desc'];

// Simple helper type for sorting functions
type SortFunction = (a: Product, b: Product) => number;

// Define specific sort function types to avoid deep type instantiation
const getSortFunction = (sortBy: string): SortFunction => {
  switch (sortBy) {
    case 'price-low':
      return (a, b) => a.price - b.price;
    case 'price-high':
      return (a, b) => b.price - a.price;
    case 'name-asc':
      return (a, b) => a.name.localeCompare(b.name);
    case 'name-desc':
      return (a, b) => b.name.localeCompare(a.name);
    default:
      return (a, b) => 0; // No sorting
  }
};

const ProductCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('price-low');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);

  useEffect(() => {
    // Filter products based on search term and category
    let filtered = mockProducts;
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Sort the filtered products
    const sortFunction = getSortFunction(sortBy);
    filtered = [...filtered].sort(sortFunction);
    
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-muted/30"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-muted/30 border border-white/10 rounded-md px-3 py-2 text-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-muted/30 border border-white/10 rounded-md px-3 py-2 text-sm"
          >
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
          />
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 glass-morphism rounded-lg">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-white/70">Try adjusting your search or filter criteria</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSortBy('price-low');
            }}
            className="mt-4"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
