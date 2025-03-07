
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { ProductType } from './ProductCatalog';

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

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="glass-morphism overflow-hidden transition-all duration-300 hover:shadow-lg group">
      <Link to={`/store/${product.id}`}>
        <div className="relative overflow-hidden h-48">
          <img 
            src={product.image} 
            alt={product.name} 
            className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
          />
          {product.isNew && (
            <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground">
              New
            </Badge>
          )}
        </div>
        
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg line-clamp-1">{product.name}</h3>
            <span className="text-xl font-bold text-gradient-blue">${product.price.toFixed(2)}</span>
          </div>
          <div className="flex items-center mt-1 mb-2">
            <Badge variant="outline" className="text-xs">
              {product.type}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </CardContent>
      </Link>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button size="sm" variant="ghost" asChild>
          <Link to={`/store/${product.id}`}>Details</Link>
        </Button>
        <Button size="sm" variant="primary">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
