import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JestWallet from '@/components/jestcoin/JestWallet';
import TransactionHistory from '@/components/jestcoin/TransactionHistory';
import RewardsSection from '@/components/jestcoin/RewardsSection';
import { Wallet, History, Award, ShoppingCart } from 'lucide-react';

const JestCoinPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">JestCoin</h1>
          <p className="text-white/60 mb-8">Gerencie sua carteira digital, transações e recompensas</p>
          
          <Tabs defaultValue="wallet" className="mb-8">
            <TabsList className="grid grid-cols-3 bg-black/30 backdrop-blur-sm border border-white/10">
              <TabsTrigger value="wallet" className="data-[state=active]:bg-purple-700">
                <Wallet className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Carteira</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-purple-700">
                <History className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Histórico</span>
              </TabsTrigger>
              <TabsTrigger value="rewards" className="data-[state=active]:bg-purple-700">
                <Award className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Recompensas</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="wallet" className="mt-6">
              <JestWallet />
            </TabsContent>
            
            <TabsContent value="history" className="mt-6">
              <TransactionHistory />
            </TabsContent>
            
            <TabsContent value="rewards" className="mt-6">
              <RewardsSection />
            </TabsContent>
          </Tabs>
          
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Sobre o JestCoin</h3>
            <p className="text-white/70 mb-3">
              JestCoin é a moeda digital oficial da plataforma JESTFLY, projetada para recompensar fãs, artistas e colaboradores.
            </p>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="bg-purple-600/20 p-2 rounded-full mr-3 mt-1">
                  <Wallet className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Armazene e Transfira</h4>
                  <p className="text-sm text-white/60">Guarde seus JestCoins na carteira digital e transfira para outros usuários.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-600/20 p-2 rounded-full mr-3 mt-1">
                  <ShoppingCart className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Compre Produtos</h4>
                  <p className="text-sm text-white/60">Use JestCoins para comprar produtos exclusivos na loja.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-yellow-600/20 p-2 rounded-full mr-3 mt-1">
                  <Award className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Ganhe Recompensas</h4>
                  <p className="text-sm text-white/60">Participe de atividades na plataforma e receba JestCoins como recompensa.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JestCoinPage;
