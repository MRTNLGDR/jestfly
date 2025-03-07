
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye } from "lucide-react";
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/styles/theme';

export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  image_url?: string;
  type: 'nft' | 'music' | 'merch' | 'collectible';
  stock?: number;
  metadata?: any;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const theme = useTheme();
  const { id, title, price, image_url, type } = product;

  const getGradient = (productType: string) => {
    switch (productType) {
      case 'nft':
        return theme.colors.gradients.purple;
      case 'music':
        return theme.colors.gradients.blue;
      case 'merch':
        return theme.colors.gradients.primary;
      case 'collectible':
        return theme.colors.gradients.green;
      default:
        return 'from-gray-700 to-gray-900';
    }
  };

  const getTypeColor = (productType: string) => {
    switch (productType) {
      case 'nft':
        return 'gradient';
      case 'music':
        return 'info';
      case 'merch':
        return 'secondary';
      case 'collectible':
        return 'success';
      default:
        return 'default';
    }
  };

  const getIcon = (productType: string) => {
    switch (productType) {
      case 'nft':
        return '💎';
      case 'music':
        return '🎵';
      case 'merch':
        return '👕';
      case 'collectible':
        return '🎁';
      default:
        return '📦';
    }
  };

  return (
    <Card 
      variant="glass" 
      className="overflow-hidden transition-all hover-scale group"
    >
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          {image_url ? (
            <img 
              src={image_url} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center text-6xl"
              style={{ background: getGradient(type) }}
            >
              {getIcon(type)}
            </div>
          )}
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-black/60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="gradient" 
              rounded="full"
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            
            <Link to={`/store/product/${id}`}>
              <Button 
                size="icon" 
                variant="glass" 
                rounded="full"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="absolute top-3 left-3">
          <Badge variant={getTypeColor(type) as any} className="uppercase">
            {type}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium text-white truncate mb-2">{title}</h3>
        
        <div className="flex justify-between items-center">
          <span className="font-mono text-gradient-primary font-medium">${price.toFixed(2)}</span>
          
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 rounded-full text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => addToCart(product)}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
