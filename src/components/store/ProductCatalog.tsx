
import React, { useState, useMemo } from 'react';
import { Product, ProductType } from '@/types/product';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define a specific type for sort functions to avoid type inference issues
type SortFunction = (a: Product, b: Product) => number;

// Available sort options
enum SortOption {
  PriceLowToHigh = 'price-asc',
  PriceHighToLow = 'price-desc',
  Newest = 'newest',
  Alphabetical = 'alphabetical'
}

interface ProductCatalogProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
  showFilters?: boolean;
  initialType?: ProductType | 'all';
  showAddToCart?: boolean;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onAddToCart,
  showFilters = true,
  initialType = 'all',
  showAddToCart = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ProductType | 'all'>(initialType);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.Newest);

  // Helper function to get sort function based on selected option
  const getSortFunction = (option: SortOption): SortFunction => {
    switch (option) {
      case SortOption.PriceLowToHigh:
        return (a, b) => a.price - b.price;
      case SortOption.PriceHighToLow:
        return (a, b) => b.price - a.price;
      case SortOption.Newest:
        return (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case SortOption.Alphabetical:
        return (a, b) => (a.name || a.title || '').localeCompare(b.name || b.title || '');
      default:
        return (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        // Filter by search term
        const productName = product.name || product.title || '';
        const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             product.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filter by product type
        const matchesType = selectedType === 'all' || product.type === selectedType;
        
        return matchesSearch && matchesType;
      })
      .sort(getSortFunction(sortOption));
  }, [products, searchTerm, selectedType, sortOption]);

  return (
    <div className="w-full">
      {showFilters && (
        <div className="mb-8 p-4 rounded-lg bg-card border border-white/10 backdrop-blur-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search */}
            <div>
              <Label htmlFor="search" className="mb-2 block">Search</Label>
              <Input
                id="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-background/50 border-white/10"
              />
            </div>
            
            {/* Product Type Filter */}
            <div>
              <Label htmlFor="productType" className="mb-2 block">Product Type</Label>
              <Select value={selectedType} onValueChange={(value) => setSelectedType(value as ProductType | 'all')}>
                <SelectTrigger id="productType" className="bg-background/50 border-white/10">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={ProductType.NFT}>NFTs</SelectItem>
                  <SelectItem value={ProductType.MUSIC}>Music</SelectItem>
                  <SelectItem value={ProductType.MERCH}>Merch</SelectItem>
                  <SelectItem value={ProductType.COLLECTIBLE}>Collectibles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Sort Options */}
            <div>
              <Label htmlFor="sortOption" className="mb-2 block">Sort By</Label>
              <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                <SelectTrigger id="sortOption" className="bg-background/50 border-white/10">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SortOption.Newest}>Newest</SelectItem>
                  <SelectItem value={SortOption.PriceLowToHigh}>Price: Low to High</SelectItem>
                  <SelectItem value={SortOption.PriceHighToLow}>Price: High to Low</SelectItem>
                  <SelectItem value={SortOption.Alphabetical}>Alphabetically</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Clear Filters Button */}
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSortOption(SortOption.Newest);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => onAddToCart && onAddToCart(product)}
              showAddToCart={showAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};
