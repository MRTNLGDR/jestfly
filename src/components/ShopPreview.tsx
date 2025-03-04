
import { Link } from 'react-router-dom';
import { ArrowRight, Gift, ShoppingCart } from 'lucide-react';
import { GlassCard } from './ui/glass-card';
import { Button } from './ui/button';
import JestCoinTicker from './JestCoinTicker';

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
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Loja</h2>
            <p className="text-white/60">Produtos exclusivos e colecionáveis</p>
          </div>
          <div className="flex items-center mt-4 sm:mt-0">
            <JestCoinTicker compact className="mr-4" />
            <Link to="/store">
              <Button variant="default" className="bg-purple-600 hover:bg-purple-700">
                Ver Todos <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map(product => (
            <Link to={`/store/product/${product.id}`} key={product.id}>
              <GlassCard className="h-full transition-all duration-300 hover:border-purple-500/50 group">
                <div className="relative h-48 rounded-t-lg overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                    <div className="flex items-center text-yellow-400 text-sm font-mono">
                      {product.jestCoinPrice} JC
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2">{product.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-white/90">R$ {product.price.toFixed(2)}</span>
                      <span className="text-yellow-400 text-sm">ou {product.jestCoinPrice} JestCoin</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="default" 
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>

        <div className="mt-10 p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-lg border border-white/10 flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <div className="flex items-center mb-2">
              <Gift className="h-5 w-5 text-yellow-400 mr-2" />
              <h3 className="text-xl font-bold text-white">Compre com JestCoin</h3>
            </div>
            <p className="text-white/70 mb-4">
              Use seus JestCoins para adquirir produtos exclusivos com descontos especiais e benefícios para membros.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/jestcoin">
                <Button variant="outline" className="border-yellow-500/30 hover:border-yellow-500 text-white">
                  Ganhar JestCoins
                </Button>
              </Link>
              <Link to="/store">
                <Button variant="default" className="bg-purple-600 hover:bg-purple-700">
                  Ver Produtos
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            {/* 3D coin or illustration would go here */}
            <div className="h-24 w-24 relative">
              <JestCoinTicker />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPreview;
