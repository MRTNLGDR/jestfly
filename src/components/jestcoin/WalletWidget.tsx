
import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@/hooks/useWallet';
import GoldCoin3D from '@/components/GoldCoin3D';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet } from 'lucide-react';

interface WalletWidgetProps {
  className?: string;
}

const WalletWidget: React.FC<WalletWidgetProps> = ({ className = "" }) => {
  const { wallet, isLoading } = useWallet();

  if (isLoading) {
    return (
      <div className={`flex items-center px-3 py-2 bg-black/30 backdrop-blur-md border border-yellow-500/20 rounded-lg ${className}`}>
        <Skeleton className="h-8 w-8 rounded-full mr-2" />
        <Skeleton className="h-4 w-16" />
      </div>
    );
  }

  if (!wallet) {
    return (
      <Link 
        to="/jestcoin"
        className={`flex items-center px-3 py-2 bg-black/30 backdrop-blur-md border border-yellow-500/20 rounded-lg hover:border-yellow-500/40 transition-all ${className}`}
      >
        <Wallet className="h-4 w-4 text-yellow-500 mr-2" />
        <span className="text-sm text-yellow-100">Ativar carteira</span>
      </Link>
    );
  }

  return (
    <Link
      to="/jestcoin"
      className={`flex items-center px-3 py-1 bg-black/30 backdrop-blur-md border border-yellow-500/20 rounded-lg hover:border-yellow-500/40 transition-all ${className}`}
    >
      <div className="relative mr-2">
        <GoldCoin3D size={28} />
      </div>
      <div className="flex flex-col justify-center">
        <span className="font-mono text-sm font-semibold text-yellow-100">
          {wallet.balance.toFixed(2)}
        </span>
        <span className="text-xs text-yellow-500 leading-none">JestCoin</span>
      </div>
    </Link>
  );
};

export default WalletWidget;
