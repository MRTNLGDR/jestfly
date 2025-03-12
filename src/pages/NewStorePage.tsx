
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Music, ShoppingCart, Gift, Star, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { Card, CardContent } from '../components/ui/card';

// Product category interface
interface ProductCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  image: string;
  color: string;
}

// Product interface
interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  animated?: boolean;
}

const NewStorePage: React.FC = () => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  
  // Product categories with matching site aesthetics
  const categories: ProductCategory[] = [
    {
      id: 'merch',
      name: 'Merchandise',
      icon: <ShoppingBag size={24} />,
      description: 'Official JESTFLY merch and apparel',
      image: '/assets/imagem1.jpg',
      color: 'from-purple-900 to-indigo-700'
    },
    {
      id: 'music',
      name: 'Music',
      icon: <Music size={24} />,
      description: 'Singles, albums, and exclusive tracks',
      image: '/assets/imagem1.jpg',
      color: 'from-blue-700 to-cyan-600'
    },
    {
      id: 'collectibles',
      name: 'Collectibles',
      icon: <Star size={24} />,
      description: 'Limited edition collectible items',
      image: '/assets/imagem1.jpg',
      color: 'from-green-600 to-emerald-500'
    },
    {
      id: 'digital-goods',
      name: 'Digital Goods',
      icon: <ShoppingCart size={24} />,
      description: 'Digital downloads and virtual goods',
      image: '/assets/imagem1.jpg',
      color: 'from-red-600 to-orange-500'
    },
    {
      id: 'exclusive',
      name: 'Exclusive',
      icon: <Gift size={24} />,
      description: 'Member-only exclusive products',
      image: '/assets/imagem1.jpg',
      color: 'from-yellow-500 to-amber-400'
    },
    {
      id: 'special-offers',
      name: 'Special Offers',
      icon: <Tag size={24} />,
      description: 'Limited time special offers and bundles',
      image: '/assets/imagem1.jpg',
      color: 'from-purple-600 to-pink-500'
    }
  ];
  
  // Sample products
  const products: Product[] = [
    {
      id: 'prod-001',
      title: 'JESTFLY Logo T-Shirt',
      price: 29.99,
      image: '/assets/imagem1.jpg',
      category: 'merch',
      animated: true
    },
    {
      id: 'prod-002',
      title: 'Future Tech Hoodie',
      price: 59.99,
      image: '/assets/imagem1.jpg',
      category: 'merch',
      animated: true
    },
    {
      id: 'prod-003',
      title: 'Digital Album - Cosmic Beats',
      price: 14.99,
      image: '/assets/imagem1.jpg',
      category: 'music',
      animated: true
    },
    {
      id: 'prod-004',
      title: 'Limited Edition Vinyl',
      price: 49.99,
      image: '/assets/imagem1.jpg',
      category: 'collectibles'
    },
    {
      id: 'prod-005',
      title: 'VIP Concert Pass Bundle',
      price: 149.99,
      image: '/assets/imagem1.jpg',
      category: 'exclusive',
      animated: true
    },
    {
      id: 'prod-006',
      title: 'Digital Sound Pack',
      price: 19.99,
      image: '/assets/imagem1.jpg',
      category: 'digital-goods'
    }
  ];
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero section with gradient background */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-purple-900/20 blur-[150px]"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-900/20 blur-[150px]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">
            <span className="text-gradient-primary">JESTFLY</span> Official Store
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-2xl mb-10">
            Exclusive merchandise, music, collectibles and more
          </p>
          
          {/* Category navigation */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
            {categories.map(category => (
              <motion.div
                key={category.id}
                className={`bg-gradient-to-br ${category.color} rounded-xl p-4 cursor-pointer hover:shadow-lg hover:shadow-purple-900/20 transition-all`}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold">{category.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured products section */}
      <section className="py-16 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 tracking-tighter">
            Featured Products
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <motion.div
                key={product.id}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden border border-white/10 bg-black/60 backdrop-blur-sm hover:border-purple-500/50 transition-all h-full">
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      {/* Main product image */}
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className={`w-full h-full object-cover transition-all duration-700 ${hoveredProduct === product.id ? 'scale-110 opacity-50' : 'scale-100'}`}
                      />
                      
                      {/* Animated overlay when hovered */}
                      {hoveredProduct === product.id && product.animated && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <ProductAnimation type={product.category} />
                        </div>
                      )}
                      
                      {/* Category badge */}
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm border border-white/10">
                        {categories.find(c => c.id === product.category)?.name}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xl font-mono text-purple-400">${product.price}</span>
                        <motion.button 
                          className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Add to Cart
                        </motion.button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* View all button */}
          <div className="flex justify-center mt-16">
            <motion.button 
              className="group flex items-center space-x-2 px-6 py-3 rounded-full border border-white/30 text-white bg-black/40 hover:bg-black/60 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm font-medium uppercase">Browse All Products</span>
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          </div>
        </div>
      </section>
      
      {/* Collections section */}
      <section className="py-16 bg-black/90 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 tracking-tighter">
            Exclusive Collections
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              className="relative rounded-xl overflow-hidden h-80 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <img 
                src="/assets/imagem1.jpg" 
                alt="Limited Edition Collection" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="text-2xl font-bold mb-2">Limited Edition Collection</h3>
                  <p className="text-white/70 mb-4">Exclusive items available for a limited time only</p>
                  <motion.button 
                    className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore Collection
                  </motion.button>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative rounded-xl overflow-hidden h-80 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <img 
                src="/assets/imagem1.jpg" 
                alt="Tour Merchandise" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="text-2xl font-bold mb-2">Tour Merchandise</h3>
                  <p className="text-white/70 mb-4">Official merchandise from the latest world tour</p>
                  <motion.button 
                    className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore Collection
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Component for animated product previews
const ProductAnimation: React.FC<{type: string}> = ({ type }) => {
  // Different animations based on product type
  switch(type) {
    case 'merch':
      return (
        <motion.div 
          className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0, -10, 0],
          }}
          transition={{ 
            duration: 3, 
            ease: "easeInOut", 
            repeat: Infinity 
          }}
        >
          <ShoppingBag size={48} className="text-white" />
        </motion.div>
      );
    case 'music':
      return (
        <motion.div className="flex space-x-2">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-16 bg-purple-500 rounded-full"
              animate={{
                height: [16, 40, 16, 30, 16],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.2,
                repeat: Infinity
              }}
            />
          ))}
        </motion.div>
      );
    case 'exclusive':
      return (
        <motion.div 
          className="w-40 h-40 border-4 border-gold rounded-full flex items-center justify-center"
          animate={{
            boxShadow: [
              "0 0 10px rgba(255, 215, 0, 0.5)",
              "0 0 20px rgba(255, 215, 0, 0.8)",
              "0 0 10px rgba(255, 215, 0, 0.5)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ borderColor: 'rgb(255, 215, 0)' }}
        >
          <motion.div
            className="text-2xl font-bold text-gold"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ color: 'rgb(255, 215, 0)' }}
          >
            VIP
          </motion.div>
        </motion.div>
      );
    default:
      return (
        <motion.div 
          className="w-20 h-20 bg-white rounded-md"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      );
  }
};

export default NewStorePage;
