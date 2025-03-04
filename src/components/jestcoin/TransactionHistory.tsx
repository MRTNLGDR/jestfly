
import React from 'react';
import { useJestCoin } from '@/hooks/jestcoin/useJestCoin';
import { GlassCard } from '@/components/ui/glass-card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { ArrowDownLeft, ArrowUpRight, Award, CreditCard, Gem, RotateCcw, ShoppingCart } from 'lucide-react';

const TransactionHistory: React.FC = () => {
  const { transactions, isLoadingTransactions } = useJestCoin();

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'withdraw':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'purchase':
        return <ShoppingCart className="h-4 w-4 text-blue-500" />;
      case 'reward':
        return <Award className="h-4 w-4 text-yellow-500" />;
      case 'airdrop':
        return <Gem className="h-4 w-4 text-purple-500" />;
      case 'refund':
        return <RotateCcw className="h-4 w-4 text-green-500" />;
      default:
        return <CreditCard className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'reward':
      case 'airdrop':
      case 'refund':
        return 'text-green-500';
      case 'withdraw':
      case 'purchase':
        return 'text-red-500';
      default:
        return 'text-white';
    }
  };

  const getAmountPrefix = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'reward':
      case 'airdrop':
      case 'refund':
        return '+';
      case 'withdraw':
      case 'purchase':
        return '-';
      default:
        return '';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'dd/MM/yyyy HH:mm', { locale: pt });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <GlassCard className="p-6">
      <h3 className="text-xl font-bold text-white mb-6">Histórico de Transações</h3>
      
      {isLoadingTransactions ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/4 bg-white/10" />
                <Skeleton className="h-3 w-1/2 bg-white/10" />
              </div>
              <Skeleton className="h-6 w-20 bg-white/10" />
            </div>
          ))}
        </div>
      ) : transactions && transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.map(transaction => (
            <div key={transaction.id} className="flex items-center p-3 rounded-lg bg-black/30 border border-white/5">
              <div className="h-10 w-10 rounded-full bg-black/50 flex items-center justify-center mr-4">
                {getTransactionIcon(transaction.transaction_type)}
              </div>
              
              <div className="flex-1">
                <p className="text-white font-medium">{transaction.description || transaction.transaction_type}</p>
                <p className="text-xs text-white/60">{formatDate(transaction.created_at)}</p>
              </div>
              
              <div className={`font-mono font-bold ${getTransactionColor(transaction.transaction_type)}`}>
                {getAmountPrefix(transaction.transaction_type)}
                {Math.abs(transaction.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-white/60">Nenhuma transação encontrada</p>
        </div>
      )}
    </GlassCard>
  );
};

export default TransactionHistory;
