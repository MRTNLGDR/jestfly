
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GlassHeader from '@/components/GlassHeader';
import Footer from '@/components/Footer';
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from '@/components/store/ProductCard';
import ProductCatalog from '@/components/store/ProductCatalog';
import { ShoppingCart, Heart, ArrowLeft, Plus, Minus, Share, Check } from 'lucide-react';

const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);
  
  const fetchProduct = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/store');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // In a real app, you would save this to the user's wishlist
  };
  
  const getGradient = (productType?: string) => {
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
  
  const menuItems = [
    { label: "Store", href: "/store" },
    { label: "Product", href: `/store/product/${productId}` }
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <GlassHeader menuItems={menuItems} />
      
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            className="text-white/70 hover:text-white hover:bg-white/10 mb-6"
            onClick={() => navigate('/store')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Store
          </Button>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <Skeleton className="aspect-square rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-24 w-full" />
                <div className="space-y-2 pt-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
          ) : product ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className={`aspect-square rounded-lg bg-gradient-to-br ${getGradient(product.type)} flex items-center justify-center overflow-hidden`}>
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="text-8xl">
                      {product.type === 'nft' ? '💎' : 
                       product.type === 'music' ? '🎵' : 
                       product.type === 'merch' ? '👕' : '🎁'}
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-white/10 backdrop-blur-sm text-white uppercase">
                      {product.type}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                  
                  <div className="text-2xl font-mono mb-6">${product.price.toFixed(2)}</div>
                  
                  <p className="text-white/70 mb-8">{product.description}</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border border-white/10 rounded-md">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-10 rounded-none text-white hover:bg-white/10"
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <div className="w-12 text-center">{quantity}</div>
                        
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-10 rounded-none text-white hover:bg-white/10"
                          onClick={incrementQuantity}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {product.stock !== undefined && (
                        <div className="text-sm text-white/60">
                          {product.stock > 0 
                            ? `${product.stock} in stock` 
                            : 'Out of stock'}
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <Button 
                        className="col-span-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className={`border-white/10 ${isWishlisted ? 'bg-pink-600 border-pink-600 text-white' : 'text-white hover:bg-white/10'}`}
                        onClick={toggleWishlist}
                      >
                        <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-white/10 text-white hover:bg-white/10"
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share Product
                    </Button>
                  </div>
                  
                  {product.metadata && (
                    <div className="mt-8 border border-white/10 rounded-lg p-4 bg-white/5">
                      <h3 className="text-sm font-medium text-white/70 mb-2">Product Details</h3>
                      <div className="space-y-2">
                        {Object.entries(product.metadata).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-white/50">{key}</span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <Separator className="my-12 bg-white/10" />
              
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="neo-blur p-1 rounded-lg mb-6">
                  <TabsTrigger value="description" className="data-[state=active]:bg-white/10">
                    Description
                  </TabsTrigger>
                  <TabsTrigger value="specifications" className="data-[state=active]:bg-white/10">
                    Specifications
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="data-[state=active]:bg-white/10">
                    Reviews
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="space-y-4 text-white/70">
                  <p>{product.description || 'No description available.'}</p>
                </TabsContent>
                
                <TabsContent value="specifications" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/50">Type</span>
                        <span className="capitalize">{product.type}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/50">SKU</span>
                        <span className="font-mono">{product.id.substring(0, 8).toUpperCase()}</span>
                      </div>
                      {product.stock !== undefined && (
                        <div className="flex justify-between py-2 border-b border-white/10">
                          <span className="text-white/50">Availability</span>
                          <span className={product.stock > 0 ? 'text-green-500' : 'text-red-500'}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {product.metadata && (
                      <div className="space-y-2">
                        {Object.entries(product.metadata).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-2 border-b border-white/10">
                            <span className="text-white/50 capitalize">{key.replace('_', ' ')}</span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <div className="text-center py-12 text-white/50">
                    <p>No reviews yet.</p>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-16">
                <h2 className="text-2xl font-bold mb-8">Related Products</h2>
                <ProductCatalog category={product.type} limit={4} />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/60">Product not found</p>
              <Button 
                className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={() => navigate('/store')}
              >
                Back to Store
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
