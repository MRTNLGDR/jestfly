
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/hooks/auth/useAuth';
import { useWallet } from '@/hooks/useWallet';
import WalletCard from '@/components/jestcoin/WalletCard';
import TransactionList from '@/components/jestcoin/TransactionList';
import TransferForm from '@/components/jestcoin/TransferForm';
import GoldCoin3D from '@/components/GoldCoin3D';

import { TypographyH2, TypographyP } from '@/components/ui/typography';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  History, 
  RefreshCw 
} from 'lucide-react';

const JestCoinPage = () => {
  const { user } = useAuth();
  const { wallet, transactions, isLoading, fetchWallet, fetchTransactions } = useWallet();
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  
  const handleRefresh = () => {
    fetchWallet();
    fetchTransactions();
  };
  
  return (
    <>
      <Helmet>
        <title>JestCoin | JESTFLY</title>
      </Helmet>
      
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <GoldCoin3D size={64} className="mr-4" />
            <div>
              <TypographyH2>JestCoin</TypographyH2>
              <TypographyP>
                Gerencie e transfira sua moeda digital
              </TypographyP>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna da carteira */}
          <div className="lg:col-span-1">
            <WalletCard 
              onTransfer={() => setIsTransferOpen(true)} 
            />
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button 
                variant="outline" 
                className="bg-black/40 border-green-500/30 text-green-300 hover:bg-green-500/10"
                onClick={() => setIsTransferOpen(true)}
              >
                <ArrowDownRight className="mr-2 h-4 w-4" />
                Receber
              </Button>
              
              <Button 
                variant="outline" 
                className="bg-black/40 border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                onClick={() => setIsTransferOpen(true)}
              >
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Enviar
              </Button>
            </div>
            
            <div className="mt-6 bg-black/40 backdrop-blur-md border border-purple-500/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <History className="h-5 w-5 mr-2 text-purple-400" />
                <span>Informações</span>
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">O que é JestCoin?</p>
                  <p className="text-gray-300">
                    JestCoin é a moeda digital da plataforma JESTFLY, utilizada para transações e recompensas.
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Como obter JestCoin?</p>
                  <p className="text-gray-300">
                    Você pode ganhar JestCoin participando de eventos, comprando no marketplace ou recebendo transferências de outros usuários.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Coluna de transações/histórico */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full bg-black/60 border border-purple-500/20">
                <TabsTrigger value="all" className="flex-1">Todas</TabsTrigger>
                <TabsTrigger value="incoming" className="flex-1">Recebidas</TabsTrigger>
                <TabsTrigger value="outgoing" className="flex-1">Enviadas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <TransactionList 
                  transactions={transactions} 
                  isLoading={isLoading} 
                />
              </TabsContent>
              
              <TabsContent value="incoming">
                <TransactionList 
                  transactions={transactions.filter(t => 
                    t.transaction_type === 'transfer_in' || 
                    t.transaction_type === 'deposit' ||
                    t.transaction_type === 'airdrop' ||
                    t.transaction_type === 'reward'
                  )} 
                  isLoading={isLoading} 
                />
              </TabsContent>
              
              <TabsContent value="outgoing">
                <TransactionList 
                  transactions={transactions.filter(t => 
                    t.transaction_type === 'transfer_out' || 
                    t.transaction_type === 'withdrawal' ||
                    t.transaction_type === 'purchase'
                  )} 
                  isLoading={isLoading} 
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <TransferForm 
        isOpen={isTransferOpen} 
        onClose={() => setIsTransferOpen(false)} 
      />
    </>
  );
};

export default JestCoinPage;
