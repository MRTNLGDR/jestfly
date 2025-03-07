
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Product, ProductType } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
  showAddToCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  showAddToCart = true,
}) => {
  // Helper function to get product type badge color
  const getProductTypeBadge = (type: ProductType) => {
    switch (type) {
      case ProductType.NFT:
        return 'bg-accent text-white';
      case ProductType.MUSIC:
        return 'bg-primary text-white';
      case ProductType.MERCH:
        return 'bg-secondary text-secondary-foreground';
      case ProductType.COLLECTIBLE:
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Helper function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const productName = product.name || product.title || 'Unnamed Product';
  const productImage = product.image || product.image_url || '/placeholder.svg';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card border border-white/10 backdrop-blur-sm relative">
      {/* Product Type Badge */}
      <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs ${getProductTypeBadge(product.type)}`}>
        {product.type}
      </div>
      
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <img 
            src={productImage} 
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      
      <CardHeader className="p-4 pb-0">
        <Link to={`/product/${product.id}`} className="hover:underline">
          <h3 className="text-lg font-medium line-clamp-1">{productName}</h3>
        </Link>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <p className="text-muted-foreground line-clamp-2 text-sm h-10">
          {product.description}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-lg font-bold">{formatPrice(product.price)}</div>
        
        {showAddToCart && (
          <Button 
            variant="secondary"
            size="sm" 
            onClick={onAddToCart}
          >
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
