
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Product } from '@/components/store/ProductCatalog';
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  PlusCircle,
  MinusCircle,
  Music,
  Package,
  Image as ImageIcon,
  Award
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCatalog from '@/components/store/ProductCatalog';
import { toast } from 'sonner';

// Sample product data (would come from API in production)
const sampleProducts: Product[] = [
  {
    id: '1',
    title: 'Digital Dream NFT',
    description: 'Limited edition digital artwork showcasing a futuristic crystal landscape with neon accents. This NFT is part of the JESTFLY Genesis Collection and includes exclusive community access.',
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
    description: 'Latest electronic music release featuring 5 original tracks inspired by late-night studio sessions. Includes bonus stems and project files for remixers.',
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
    description: 'Premium cotton t-shirt with logo printed using specialty inks that glow under UV light. Perfect for events and shows.',
    price: 29.99,
    image: '/placeholder.svg',
    category: 'merch',
    type: 'Clothing'
  },
  {
    id: '4',
    title: 'Signed Vinyl Collection',
    description: 'Limited edition signed vinyl records featuring top JESTFLY artists. Each box is numbered and includes a certificate of authenticity.',
    price: 149.99,
    image: '/placeholder.svg',
    category: 'collectible',
    featured: true,
    artist: 'Various Artists',
    type: 'Collectible'
  },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'nft':
      return <ImageIcon className="text-purple-400" />;
    case 'music':
      return <Music className="text-blue-400" />;
    case 'merch':
      return <Package className="text-green-400" />;
    case 'collectible':
      return <Award className="text-amber-400" />;
    default:
      return <Package />;
  }
};

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll use the sample data
        const foundProduct = sampleProducts.find(p => p.id === productId);
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          // Product not found
          navigate('/store');
          toast.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId, navigate]);

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} ${product?.title} to cart`);
    // Add to cart logic would go here
  };

  const handleAddToWishlist = () => {
    toast.success(`Added ${product?.title} to wishlist`);
    // Add to wishlist logic would go here
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4 flex justify-center">
        <div className="animate-pulse-slow">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h2 className="text-title-lg mb-4">Product not found</h2>
        <Button onClick={() => navigate('/store')}>Back to Store</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <Button 
        variant="ghost" 
        className="mb-8" 
        onClick={() => navigate('/store')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Store
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="glass-morphism rounded-xl overflow-hidden aspect-square">
            <img 
              src={product.image || '/placeholder.svg'} 
              alt={product.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        </motion.div>
        
        {/* Product Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-2">
            {getCategoryIcon(product.category)}
            <span className="text-body-sm text-white/60">{product.category.toUpperCase()}</span>
          </div>
          
          <h1 className="text-gradient-primary mb-2">{product.title}</h1>
          
          {product.artist && (
            <p className="text-body-md text-accent mb-4">by {product.artist}</p>
          )}
          
          <div className="text-display-sm font-bold text-white mb-6">
            ${product.price.toFixed(2)}
          </div>
          
          <div className="mb-8">
            <p className="text-body-md">{product.description}</p>
          </div>
          
          {/* Quantity selector for physical products */}
          {(product.category === 'merch' || product.category === 'collectible') && (
            <div className="flex items-center gap-4 mb-8">
              <span className="text-body-md">Quantity:</span>
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <MinusCircle className="h-5 w-5" />
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={increaseQuantity}
                >
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-4">
            <Button 
              className="flex-1 min-w-32"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleAddToWishlist}
            >
              <Heart className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Tabs for additional information */}
      <div className="mb-16">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="glass-morphism w-full justify-start">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            {product.category === 'nft' && (
              <TabsTrigger value="blockchain">Blockchain Info</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="details" className="mt-6">
            <div className="glass-morphism p-6 rounded-xl">
              <h3 className="text-title-md mb-4">Product Details</h3>
              <p>Detailed information about this product would go here, including its history, inspiration, and any special features.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-6">
            <div className="glass-morphism p-6 rounded-xl">
              <h3 className="text-title-md mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-body-sm text-white/60">Type</p>
                  <p>{product.type}</p>
                </div>
                {product.releaseDate && (
                  <div>
                    <p className="text-body-sm text-white/60">Release Date</p>
                    <p>{new Date(product.releaseDate).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-body-sm text-white/60">Category</p>
                  <p>{product.category}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {product.category === 'nft' && (
            <TabsContent value="blockchain" className="mt-6">
              <div className="glass-morphism p-6 rounded-xl">
                <h3 className="text-title-md mb-4">Blockchain Information</h3>
                <p>This section would contain blockchain-specific information like contract address, token ID, blockchain network, and ownership history.</p>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
      
      {/* Related products */}
      <section>
        <h2 className="text-gradient-purple mb-8">You Might Also Like</h2>
        <ProductCatalog 
          category={product.category} 
          limit={4} 
        />
      </section>
    </div>
  );
};

export default ProductDetailPage;
