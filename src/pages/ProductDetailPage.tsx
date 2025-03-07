
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProductCatalog } from '@/components/store/ProductCatalog';
import { Product, ProductType, mapDbProductToProduct } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { Heart, Share2, ShoppingCart, Clock } from 'lucide-react';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch product details
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          console.error('Error fetching product:', error);
          toast({
            title: 'Error',
            description: 'Failed to load product details.',
            variant: 'destructive',
          });
          return;
        }
        
        if (data) {
          const mappedProduct = mapDbProductToProduct(data);
          setProduct(mappedProduct);
          
          // Fetch related products based on type
          const { data: relatedData, error: relatedError } = await supabase
            .from('products')
            .select('*')
            .eq('type', data.type)
            .neq('id', id)
            .limit(4);
            
          if (relatedError) {
            console.error('Error fetching related products:', relatedError);
          } else if (relatedData) {
            const mappedRelatedProducts = relatedData.map(mapDbProductToProduct);
            setRelatedProducts(mappedRelatedProducts);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [id, toast]);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    toast({
      title: 'Added to cart',
      description: `${product.name || product.title} has been added to your cart.`,
    });
    // Implement actual cart functionality here
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  // Render product type specific content
  const renderProductTypeContent = () => {
    if (!product) return null;
    
    switch (product.type) {
      case ProductType.NFT:
        return (
          <div className="mt-8 p-6 bg-card rounded-lg border border-white/10">
            <h3 className="text-title-md mb-4">NFT Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-title-sm mb-2">Blockchain</h4>
                <p className="text-white/70">Ethereum</p>
              </div>
              <div>
                <h4 className="text-title-sm mb-2">Ownership</h4>
                <p className="text-white/70">Full commercial rights</p>
              </div>
              <div>
                <h4 className="text-title-sm mb-2">Minting Date</h4>
                <p className="text-white/70">{product.releaseDate || 'Coming soon'}</p>
              </div>
              <div>
                <h4 className="text-title-sm mb-2">Editions</h4>
                <p className="text-white/70">Limited to {product.stock} pieces</p>
              </div>
            </div>
          </div>
        );
        
      case ProductType.MUSIC:
        return (
          <div className="mt-8 p-6 bg-card rounded-lg border border-white/10">
            <h3 className="text-title-md mb-4">Track Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-title-sm mb-2">Genre</h4>
                <p className="text-white/70">{product.metadata?.genre || 'Electronic'}</p>
              </div>
              <div>
                <h4 className="text-title-sm mb-2">Release Date</h4>
                <p className="text-white/70">{product.releaseDate || 'Recently released'}</p>
              </div>
              <div>
                <h4 className="text-title-sm mb-2">BPM</h4>
                <p className="text-white/70">{product.metadata?.bpm || '120'}</p>
              </div>
              <div>
                <h4 className="text-title-sm mb-2">Key</h4>
                <p className="text-white/70">{product.metadata?.key || 'C minor'}</p>
              </div>
            </div>
          </div>
        );
        
      case ProductType.MERCH:
        return (
          <div className="mt-8 p-6 bg-card rounded-lg border border-white/10">
            <h3 className="text-title-md mb-4">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-title-sm mb-2">Material</h4>
                <p className="text-white/70">{product.metadata?.material || '100% Cotton'}</p>
              </div>
              <div>
                <h4 className="text-title-sm mb-2">Sizes</h4>
                <p className="text-white/70">{product.metadata?.sizes || 'S, M, L, XL'}</p>
              </div>
              <div>
                <h4 className="text-title-sm mb-2">Care</h4>
                <p className="text-white/70">{product.metadata?.care || 'Machine wash cold'}</p>
              </div>
              <div>
                <h4 className="text-title-sm mb-2">Origin</h4>
                <p className="text-white/70">{product.metadata?.origin || 'Imported'}</p>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-display-md mb-4">Product Not Found</h1>
        <p className="text-body-lg text-white/70 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button variant="glass" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }
  
  const productTitle = product.name || product.title || 'Unnamed Product';
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="aspect-square bg-card rounded-xl overflow-hidden border border-white/10 relative">
          <img 
            src={product.image || product.image_url || '/placeholder.svg'} 
            alt={productTitle}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="glass" size="icon" className="rounded-full">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="glass" size="icon" className="rounded-full">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Product Details */}
        <div className="space-y-6">
          {/* Product Type Badge */}
          <Badge className="mb-2 uppercase" variant="outline">
            {product.type}
          </Badge>
          
          <h1 className="text-display-sm md:text-display-md">{productTitle}</h1>
          
          {/* Artist/Creator Info */}
          {product.artist && (
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center">
                {product.artist.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-white/70">Created by</p>
                <p className="font-medium">{product.artist}</p>
              </div>
            </div>
          )}
          
          {/* Price and Stock */}
          <div className="flex flex-wrap justify-between items-end">
            <div>
              <p className="text-sm text-white/70 mb-1">Price</p>
              <p className="text-display-xs">{formatPrice(product.price)}</p>
            </div>
            <div className="flex items-center text-white/70">
              <Clock className="h-4 w-4 mr-2" />
              {product.stock > 0 ? (
                <span>{product.stock} {product.type === ProductType.NFT ? "available" : "in stock"}</span>
              ) : (
                <span className="text-destructive">Out of stock</span>
              )}
            </div>
          </div>
          
          {/* Description */}
          <Separator className="bg-white/10" />
          <div>
            <h3 className="text-title-md mb-2">Description</h3>
            <p className="text-white/70">{product.description}</p>
          </div>
          
          {/* Add to Cart Button */}
          <div className="pt-4">
            <Button 
              size="lg" 
              className="w-full flex items-center justify-center gap-2" 
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
      
      {/* Product Type Specific Details */}
      {renderProductTypeContent()}
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-display-sm mb-8">Related Products</h2>
          <ProductCatalog 
            products={relatedProducts}
            showFilters={false}
            showAddToCart={true}
            onAddToCart={handleAddToCart}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
