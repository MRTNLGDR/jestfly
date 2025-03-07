
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import ProductCatalog from '@/components/store/ProductCatalog';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

const StorePage = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  
  return (
    <div className="container mx-auto py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-gradient-primary">JESTFLY Store</h1>
        <p className="lead max-w-3xl mx-auto">
          Discover exclusive digital and physical products from our community of artists.
          From limited edition NFTs to premium merchandise, find something that resonates with you.
        </p>
      </motion.div>
      
      {/* Featured Products Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-gradient-blue">Featured Items</h2>
          <Button variant="ghost" size="sm" className="group">
            <ShoppingCart className="mr-2 group-hover:text-primary transition-colors" />
            View Cart
          </Button>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-morphism p-6 rounded-xl"
        >
          <ProductCatalog 
            featuredOnly={true} 
            limit={4} 
          />
        </motion.div>
      </section>
      
      {/* All Products Section */}
      <section>
        <h2 className="text-gradient-green mb-8">Browse All Products</h2>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-8 overflow-x-auto">
            <TabsList className="glass-morphism inline-flex w-full justify-start p-1 overflow-x-auto">
              <TabsTrigger value="all" className="px-4">All Items</TabsTrigger>
              <TabsTrigger value="nft" className="px-4">NFTs</TabsTrigger>
              <TabsTrigger value="music" className="px-4">Music</TabsTrigger>
              <TabsTrigger value="merch" className="px-4">Merchandise</TabsTrigger>
              <TabsTrigger value="collectible" className="px-4">Collectibles</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm border border-white/5 p-6 rounded-xl">
            <TabsContent value="all" className="mt-0">
              <ProductCatalog />
            </TabsContent>
            
            <TabsContent value="nft" className="mt-0">
              <ProductCatalog 
                category="nft" 
              />
            </TabsContent>
            
            <TabsContent value="music" className="mt-0">
              <ProductCatalog 
                category="music" 
              />
            </TabsContent>
            
            <TabsContent value="merch" className="mt-0">
              <ProductCatalog 
                category="merch" 
              />
            </TabsContent>
            
            <TabsContent value="collectible" className="mt-0">
              <ProductCatalog 
                category="collectible" 
              />
            </TabsContent>
          </div>
        </Tabs>
      </section>
    </div>
  );
};

export default StorePage;
