
import React from 'react';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  ShoppingCart, 
  Gift, 
  Coins, 
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Transaction, TransactionType } from '@/types/wallet';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  className?: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  isLoading,
  className = "" 
}) => {
  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownRight className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'transfer_in':
        return <ArrowDownRight className="h-4 w-4 text-green-500" />;
      case 'transfer_out':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'purchase':
        return <ShoppingCart className="h-4 w-4 text-blue-500" />;
      case 'reward':
        return <Gift className="h-4 w-4 text-purple-500" />;
      case 'airdrop':
        return <Coins className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionLabel = (type: TransactionType) => {
    switch (type) {
      case 'deposit':
        return 'Depósito';
      case 'withdrawal':
        return 'Saque';
      case 'transfer_in':
        return 'Recebido';
      case 'transfer_out':
        return 'Enviado';
      case 'purchase':
        return 'Compra';
      case 'reward':
        return 'Recompensa';
      case 'airdrop':
        return 'Airdrop';
      default:
        return type;
    }
  };

  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case 'deposit':
      case 'transfer_in':
      case 'reward':
      case 'airdrop':
        return 'text-green-500';
      case 'withdrawal':
      case 'transfer_out':
      case 'purchase':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card className={`bg-black/40 backdrop-blur-md border border-purple-500/30 ${className}`}>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-purple-500/10">
              <div className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="ml-3">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-3 w-[80px] mt-2" />
                </div>
              </div>
              <Skeleton className="h-5 w-[80px]" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card className={`bg-black/40 backdrop-blur-md border border-purple-500/30 ${className}`}>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 opacity-50 mb-3" />
            <p className="text-gray-400">Nenhuma transação encontrada</p>
            <p className="text-sm text-gray-500 mt-1">Suas transações aparecerão aqui.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-black/40 backdrop-blur-md border border-purple-500/30 ${className}`}>
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className="flex items-center justify-between py-3 px-2 border-b border-purple-500/10 hover:bg-purple-500/5 rounded-md transition-colors"
          >
            <div className="flex items-center">
              {transaction.user ? (
                <Avatar className="h-10 w-10">
                  <AvatarImage src={transaction.user.avatar || undefined} alt={transaction.user.display_name} />
                  <AvatarFallback>
                    {transaction.user.display_name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  {getTransactionIcon(transaction.transaction_type)}
                </div>
              )}
              
              <div className="ml-3">
                <div className="flex items-center">
                  <p className="font-medium">
                    {transaction.user ? transaction.user.display_name : 'Sistema'}
                  </p>
                  <Badge 
                    variant="outline" 
                    className="ml-2 text-xs px-1.5 py-0 h-4 border-purple-500/30"
                  >
                    {getTransactionLabel(transaction.transaction_type)}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {transaction.description || 'Sem descrição'} • {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true, locale: ptBR })}
                </p>
              </div>
            </div>
            
            <p className={`font-mono font-semibold ${getTransactionColor(transaction.transaction_type)}`}>
              {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TransactionList;
