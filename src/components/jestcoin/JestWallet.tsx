
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useJestCoin } from '@/hooks/jestcoin/useJestCoin';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import GoldCoin3D from '../GoldCoin3D';
import { ArrowUpRight, Award, Coins, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const JestWallet: React.FC = () => {
  const { user } = useAuth();
  const { wallet, isLoading, claimDailyReward, isClaiming } = useJestCoin();

  if (!user) {
    return (
      <GlassCard className="p-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-4">JestCoin Wallet</h3>
          <p className="text-white/60 mb-4">Faça login para acessar sua carteira JestCoin</p>
          <Link to="/auth">
            <Button variant="default" className="bg-purple-600 hover:bg-purple-700">
              Login / Registro
            </Button>
          </Link>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">JestCoin Wallet</h3>
        <div className="flex items-center space-x-2">
          <Coins className="h-5 w-5 text-yellow-400" />
          <span className="text-yellow-400 font-medium">JestCoin</span>
        </div>
      </div>

      <div className="flex items-center justify-center my-8">
        <div className="relative">
          <GoldCoin3D size={90} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="text-3xl font-bold text-white">
              {isLoading ? (
                <Skeleton className="h-8 w-16 bg-white/10" />
              ) : (
                wallet?.balance?.toFixed(2)
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button 
          variant="outline" 
          className="border-purple-500/30 hover:border-purple-500 text-white" 
          onClick={claimDailyReward}
          disabled={isClaiming || isLoading}
        >
          <Award className="h-4 w-4 mr-2 text-yellow-400" />
          {isClaiming ? 'Processando...' : 'Recompensa Diária'}
        </Button>
        
        <Link to="/airdrop" className="w-full">
          <Button 
            variant="outline" 
            className="w-full border-purple-500/30 hover:border-purple-500 text-white"
          >
            <ArrowUpRight className="h-4 w-4 mr-2 text-yellow-400" />
            Airdrop
          </Button>
        </Link>
      </div>

      <div className="border-t border-white/10 pt-4">
        <Link to="/jestcoin/transactions" className="flex items-center justify-between text-white/60 hover:text-white transition-colors">
          <div className="flex items-center">
            <History className="h-4 w-4 mr-2" />
            <span>Ver histórico de transações</span>
          </div>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </GlassCard>
  );
};

export default JestWallet;
