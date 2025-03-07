
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from './ProductCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Define a more specific Product type to match both components
export type ProductType = "nft" | "music" | "merch" | "collectible";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: ProductType;
  rating?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  stock?: number;
  createdAt: string;
}

interface ProductCatalogProps {
  products: Product[];
  showFilters?: boolean;
  featured?: boolean;
  limit?: number;
}

type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';

type FilterState = {
  search: string;
  type: string;
  priceRange: [number, number];
  sort: SortOption;
};

const initialPriceRange: [number, number] = [0, 1000];

// Dedicated sort function type to prevent infinite type recursion
type SortFunction = (a: Product, b: Product) => number;

// Helper to get the appropriate sort function
const getSortFunction = (sortOption: SortOption): SortFunction => {
  switch (sortOption) {
    case 'price-asc':
      return (a, b) => a.price - b.price;
    case 'price-desc':
      return (a, b) => b.price - a.price;
    case 'name-asc':
      return (a, b) => a.name.localeCompare(b.name);
    case 'name-desc':
      return (a, b) => b.name.localeCompare(a.name);
    case 'newest':
      return (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    default:
      return (a, b) => 0;
  }
};

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  showFilters = true,
  featured = false,
  limit
}) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: '',
    priceRange: initialPriceRange,
    sort: 'newest',
  });

  // Get unique product types for filter dropdown
  const productTypes = useMemo(() => {
    const types = new Set<string>();
    products.forEach(product => types.add(product.type));
    return Array.from(types);
  }, [products]);

  // Find min and max prices for price filter
  const priceRange = useMemo(() => {
    let min = Number.MAX_VALUE;
    let max = 0;
    
    products.forEach(product => {
      min = Math.min(min, product.price);
      max = Math.max(max, product.price);
    });
    
    return [Math.floor(min), Math.ceil(max)] as [number, number];
  }, [products]);

  // Update filters
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleTypeChange = (value: string) => {
    setFilters(prev => ({ ...prev, type: value }));
  };

  const handleSortChange = (value: string) => {
    setFilters(prev => ({ ...prev, sort: value as SortOption }));
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    // Start with featured products if featured flag is true
    let filtered = featured
      ? products.filter(product => product.isFeatured)
      : products;
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        product => 
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(product => product.type === filters.type);
    }
    
    // Apply price range filter
    filtered = filtered.filter(
      product => 
        product.price >= filters.priceRange[0] && 
        product.price <= filters.priceRange[1]
    );
    
    // Apply sorting
    const sortFn = getSortFunction(filters.sort);
    filtered = [...filtered].sort(sortFn);
    
    // Apply limit if provided
    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }
    
    return filtered;
  }, [products, filters, featured, limit]);

  return (
    <div className="container mx-auto px-4 py-8">
      {showFilters && (
        <div className="mb-8 grid gap-4 md:flex md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search products..."
              value={filters.search}
              onChange={handleSearchChange}
              className="max-w-xs"
            />
            
            <Select value={filters.type} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Product Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {productTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.sort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A-Z</SelectItem>
                <SelectItem value="name-desc">Name: Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </div>
        </div>
      )}
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
          <Button 
            variant="outline" 
            onClick={() => setFilters({
              search: '',
              type: '',
              priceRange: initialPriceRange,
              sort: 'newest',
            })}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
