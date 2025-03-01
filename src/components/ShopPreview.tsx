
import React from 'react';
import { Music, Package, Diamond, Sparkles, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface ShopCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  paymentMethods: ('money' | 'jestcoin' | 'both')[];
}

const ShopPreview: React.FC = () => {
  const categories: ShopCategory[] = [
    {
      id: 'cat1',
      name: 'NFTs',
      description: 'Limited edition digital collectibles with blockchain verification.',
      icon: <Diamond className="h-6 w-6" />,
      color: 'from-purple-600 to-purple-900',
      paymentMethods: ['jestcoin', 'both']
    },
    {
      id: 'cat2',
      name: 'Music',
      description: 'Exclusive tracks, albums and unreleased content from JESTFLY.',
      icon: <Music className="h-6 w-6" />,
      color: 'from-blue-600 to-blue-900',
      paymentMethods: ['money', 'jestcoin', 'both']
    },
    {
      id: 'cat3',
      name: 'Merchandise',
      description: 'Official branded clothing and accessories from the collection.',
      icon: <Package className="h-6 w-6" />,
      color: 'from-cyan-600 to-cyan-900',
      paymentMethods: ['money', 'both']
    },
    {
      id: 'cat4',
      name: 'Collectibles',
      description: 'Rare physical items and limited edition memorabilia.',
      icon: <Sparkles className="h-6 w-6" />,
      color: 'from-pink-600 to-pink-900',
      paymentMethods: ['jestcoin']
    }
  ];

  return (
    <section className="w-full py-20 relative overflow-hidden bg-black">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, white 2px, transparent 0)', backgroundSize: '50px 50px' }}>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 tracking-tighter">
              EXPLORE <span className="text-gradient-primary">SHOP</span>
            </h2>
            <p className="text-white/70 max-w-md">
              Discover our unique collection of digital and physical products.
            </p>
          </div>
          
          <div className="mt-6 md:mt-0">
            <button className="group flex items-center space-x-2 px-5 py-2.5 rounded-full border border-white/30 text-white bg-black/40 hover:bg-black/60 transition-colors">
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium uppercase">Browse All</span>
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-black font-bold text-xs">→</span>
              </div>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="neo-blur overflow-hidden rounded-lg border-white/10 hover:border-white/20 transition-all h-full group"
            >
              <CardContent className="p-6 flex flex-col h-full">
                {/* Icon with gradient background */}
                <div className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${category.color} group-hover:scale-105 transition-transform`}>
                  {category.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-3">{category.name}</h3>
                
                <p className="text-white/60 text-sm mb-6 flex-grow">
                  {category.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {category.paymentMethods.includes('jestcoin') && (
                    <Badge variant="outline" className="bg-yellow-900/20 text-yellow-400 border-yellow-700/40">
                      JestCoin
                    </Badge>
                  )}
                  {category.paymentMethods.includes('money') && (
                    <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-700/40">
                      Money
                    </Badge>
                  )}
                  {category.paymentMethods.includes('both') && (
                    <Badge variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-700/40">
                      Flexible
                    </Badge>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-auto">
                  <div className="text-xs text-white/50 uppercase tracking-wider">
                    Browse Items
                  </div>
                  
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <span className="text-white/80 font-bold text-xs">→</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopPreview;
