
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Gift, ShoppingCart } from 'lucide-react';
import { GlassCard } from './ui/glass-card';
import { Button } from './ui/button';
import JestCoinTicker from './JestCoinTicker';

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};

const ShopPreview = () => {
  // Produtos em destaque (exemplo)
  const featuredProducts = [
    {
      id: '1',
      title: 'Camiseta JESTFLY',
      price: 299.90,
      jestCoinPrice: 150,
      imageUrl: '/placeholder.svg'
    },
    {
      id: '2',
      title: 'Pack de Samples Exclusivos',
      price: 79.90,
      jestCoinPrice: 40,
      imageUrl: '/placeholder.svg'
    },
    {
      id: '3',
      title: 'NFT Colecionável',
      price: 499.90,
      jestCoinPrice: 250,
      imageUrl: '/placeholder.svg'
    }
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-wrap items-center justify-between mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-3xl font-bold text-white">Loja</h2>
            <p className="text-white/60">Produtos exclusivos e colecionáveis</p>
          </div>
          <div className="flex items-center mt-4 sm:mt-0">
            <JestCoinTicker compact className="mr-4" />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/store">
                <Button variant="default" className="bg-purple-600 hover:bg-purple-700">
                  Ver Todos <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                y: -15,
                transition: { duration: 0.2 }
              }}
            >
              <Link to={`/store/product/${product.id}`}>
                <GlassCard className="h-full transition-all duration-300 hover:border-purple-500/50 group">
                  <div className="relative h-48 rounded-t-lg overflow-hidden">
                    <motion.img 
                      src={product.imageUrl} 
                      alt={product.title} 
                      className="w-full h-full object-cover" 
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <motion.div 
                      className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10"
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 0, 0, 0.9)" }}
                    >
                      <div className="flex items-center text-yellow-400 text-sm font-mono">
                        {product.jestCoinPrice} JC
                      </div>
                    </motion.div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2">{product.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-white/90">R$ {product.price.toFixed(2)}</span>
                        <span className="text-yellow-400 text-sm">ou {product.jestCoinPrice} JestCoin</span>
                      </div>
                      <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          size="sm" 
                          variant="default" 
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-10 p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-lg border border-white/10 flex flex-col md:flex-row items-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ boxShadow: "0 0 30px rgba(139, 92, 246, 0.3)" }}
          transition={{ duration: 0.5 }}
        >
          <div className="md:w-2/3 mb-6 md:mb-0">
            <div className="flex items-center mb-2">
              <motion.div 
                animate={{ rotate: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Gift className="h-5 w-5 text-yellow-400 mr-2" />
              </motion.div>
              <h3 className="text-xl font-bold text-white">Compre com JestCoin</h3>
            </div>
            <p className="text-white/70 mb-4">
              Use seus JestCoins para adquirir produtos exclusivos com descontos especiais e benefícios para membros.
            </p>
            <div className="flex flex-wrap gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/jestcoin">
                  <Button variant="outline" className="border-yellow-500/30 hover:border-yellow-500 text-white">
                    Ganhar JestCoins
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/store">
                  <Button variant="default" className="bg-purple-600 hover:bg-purple-700">
                    Ver Produtos
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <motion.div 
              className="h-24 w-24 relative"
              animate={{ 
                y: [0, -10, 0],
                rotateY: [0, 180, 360]
              }}
              transition={{ 
                y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                rotateY: { repeat: Infinity, duration: 8, ease: "linear" }
              }}
            >
              <JestCoinTicker />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ShopPreview;
