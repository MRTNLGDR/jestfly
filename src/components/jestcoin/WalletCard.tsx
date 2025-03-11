
import React from 'react';
import { Wallet } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import GoldCoin3D from '@/components/GoldCoin3D';
import { useWallet } from '@/hooks/useWallet';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WalletCardProps {
  onTransfer?: () => void;
  className?: string;
  compact?: boolean;
}

const WalletCard: React.FC<WalletCardProps> = ({ 
  onTransfer, 
  className = "", 
  compact = false 
}) => {
  const { wallet, isLoading } = useWallet();
  
  if (isLoading) {
    return (
      <Card className={`bg-black/40 backdrop-blur-md border border-yellow-500/30 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!wallet) {
    return (
      <Card className={`bg-black/40 backdrop-blur-md border border-yellow-500/30 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center text-yellow-500">
            <Wallet className="mr-2 h-5 w-5" />
            <p>Carteira não encontrada</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card className={`bg-black/40 backdrop-blur-md border border-yellow-500/30 ${className}`}>
        <CardContent className="p-3 flex items-center">
          <GoldCoin3D size={32} className="mr-3" />
          <div>
            <p className="text-lg font-mono text-yellow-100">{wallet.balance.toFixed(2)}</p>
            <p className="text-xs text-yellow-500">JestCoin</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={`bg-black/40 backdrop-blur-md border border-yellow-500/30 hover:border-yellow-500/50 transition-all ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="mr-4">
            <GoldCoin3D size={64} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-yellow-100">Sua Carteira</h3>
            <p className="text-sm text-yellow-200/60">
              Atualizado {formatDistanceToNow(new Date(wallet.updated_at), { addSuffix: true, locale: ptBR })}
            </p>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-3xl font-mono font-bold text-gradient-gold">
            {wallet.balance.toFixed(2)}
          </p>
          <p className="text-yellow-500 mt-1">JestCoin</p>
        </div>
      </CardContent>
      
      {onTransfer && (
        <CardFooter className="bg-black/20 p-4 border-t border-yellow-500/20">
          <Button 
            variant="outline" 
            className="w-full border-yellow-500/50 text-yellow-100 hover:bg-yellow-500/20"
            onClick={onTransfer}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Transferir JestCoin
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default WalletCard;
