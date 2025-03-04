
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';

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
  const { id, title, price, image_url, type } = product;

  const getGradient = (productType: string) => {
    switch (productType) {
      case 'nft':
        return 'from-purple-700 to-indigo-900';
      case 'music':
        return 'from-blue-700 to-cyan-900';
      case 'merch':
        return 'from-red-700 to-orange-900';
      case 'collectible':
        return 'from-green-700 to-emerald-900';
      default:
        return 'from-gray-700 to-gray-900';
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
    <Card className="overflow-hidden border-white/10 bg-black/40 backdrop-blur-sm hover:border-white/20 transition-all group">
      <div className="relative">
        <div className={`aspect-square bg-gradient-to-br ${getGradient(type)} flex items-center justify-center overflow-hidden`}>
          {image_url ? (
            <img src={image_url} alt={title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl">{getIcon(type)}</span>
          )}
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-black/60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="default" 
              className="rounded-full bg-white text-black hover:bg-gray-200"
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
                variant="outline" 
                className="rounded-full border-white/50 bg-transparent text-white hover:bg-white/20"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 text-xs rounded-full bg-black/60 backdrop-blur-sm text-white uppercase">
            {type}
          </span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium text-white truncate">{title}</h3>
        
        <div className="flex justify-between items-center mt-2">
          <span className="font-mono text-white/80">${price.toFixed(2)}</span>
          
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
