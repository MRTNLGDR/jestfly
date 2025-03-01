import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, FileImage, Video, Shapes, BookOpen, Package } from 'lucide-react';
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
  modelType?: '001' | '002' | '003'; // For 3D model preview
  animated?: boolean;
}

const EcommercePage: React.FC = () => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  
  // Product categories with matching site aesthetics
  const categories: ProductCategory[] = [
    {
      id: '3d-models',
      name: '3D Models',
      icon: <Box size={24} />,
      description: 'High-quality 3D models for your creative projects',
      image: '/assets/imagem1.jpg',
      color: 'from-purple-900 to-indigo-700'
    },
    {
      id: 'templates',
      name: 'Templates',
      icon: <Shapes size={24} />,
      description: 'Ready-to-use templates for faster workflow',
      image: '/assets/imagem1.jpg',
      color: 'from-blue-700 to-cyan-600'
    },
    {
      id: 'assets',
      name: 'Assets',
      icon: <FileImage size={24} />,
      description: 'Digital assets for enhancing your projects',
      image: '/assets/imagem1.jpg',
      color: 'from-green-600 to-emerald-500'
    },
    {
      id: 'masterclass',
      name: 'Masterclass',
      icon: <BookOpen size={24} />,
      description: 'Learn from industry experts and elevate your skills',
      image: '/assets/imagem1.jpg',
      color: 'from-red-600 to-orange-500'
    },
    {
      id: 'tutorials',
      name: 'Tutorials',
      icon: <Video size={24} />,
      description: 'Step-by-step guides for mastering 3D creation',
      image: '/assets/imagem1.jpg',
      color: 'from-yellow-500 to-amber-400'
    },
    {
      id: 'packs',
      name: 'Packs',
      icon: <Package size={24} />,
      description: 'Bundled collections at discounted prices',
      image: '/assets/imagem1.jpg',
      color: 'from-purple-600 to-pink-500'
    }
  ];
  
  // Sample products
  const products: Product[] = [
    {
      id: 'prod-001',
      title: 'Crystal Shader Collection',
      price: 49.99,
      image: '/assets/imagem1.jpg',
      category: '3d-models',
      modelType: '001',
      animated: true
    },
    {
      id: 'prod-002',
      title: 'Neon City Environment',
      price: 79.99,
      image: '/assets/imagem1.jpg',
      category: 'assets',
      modelType: '002',
      animated: true
    },
    {
      id: 'prod-003',
      title: 'Futuristic UI Kit',
      price: 39.99,
      image: '/assets/imagem1.jpg',
      category: 'templates',
      animated: true
    },
    {
      id: 'prod-004',
      title: 'Advanced 3D Lighting Course',
      price: 129.99,
      image: '/assets/imagem1.jpg',
      category: 'masterclass'
    },
    {
      id: 'prod-005',
      title: 'Complete NFT Creation Pack',
      price: 149.99,
      image: '/assets/imagem1.jpg',
      category: 'packs',
      modelType: '003',
      animated: true
    },
    {
      id: 'prod-006',
      title: 'Material Design Fundamentals',
      price: 29.99,
      image: '/assets/imagem1.jpg',
      category: 'tutorials'
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
            <span className="text-gradient-primary">3D Resources</span> Marketplace
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-2xl mb-10">
            Premium assets, templates, and learning resources for creators and designers
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
            Featured Resources
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
                          <ProductAnimation modelType={product.modelType} />
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
                          View Details
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
              <span className="text-sm font-medium uppercase">Browse All Resources</span>
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
            Curated Collections
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              className="relative rounded-xl overflow-hidden h-80 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <img 
                src="/assets/imagem1.jpg" 
                alt="NFT Creation Kit" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="text-2xl font-bold mb-2">NFT Creation Kit</h3>
                  <p className="text-white/70 mb-4">Everything you need to create and launch your NFT collection</p>
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
                alt="3D Environment Pack" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="text-2xl font-bold mb-2">3D Environment Pack</h3>
                  <p className="text-white/70 mb-4">Professional-grade environments for your 3D scenes</p>
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
const ProductAnimation: React.FC<{modelType?: '001' | '002' | '003'}> = ({ modelType }) => {
  // Different animations based on product type
  switch(modelType) {
    case '001':
      return (
        <motion.div 
          className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            borderRadius: ["50%", "25%", "50%"]
          }}
          transition={{ 
            duration: 3, 
            ease: "easeInOut", 
            repeat: Infinity 
          }}
        />
      );
    case '002':
      return (
        <motion.div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-10 h-10 bg-blue-500"
              animate={{
                y: [0, -30, 0],
                backgroundColor: [
                  "rgb(59, 130, 246)",
                  "rgb(239, 68, 68)",
                  "rgb(16, 185, 129)",
                  "rgb(59, 130, 246)"
                ]
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity
              }}
            />
          ))}
        </motion.div>
      );
    case '003':
      return (
        <motion.div 
          className="w-40 h-40 border-4 border-white/50 rounded-lg flex items-center justify-center"
          animate={{
            rotateY: [0, 360],
            boxShadow: [
              "0 0 10px rgba(139, 92, 246, 0.5)",
              "0 0 20px rgba(139, 92, 246, 0.8)",
              "0 0 10px rgba(139, 92, 246, 0.5)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.div
            className="text-2xl font-bold"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            NFT
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

export default EcommercePage;
