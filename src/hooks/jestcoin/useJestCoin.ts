
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useActivityLogger } from '@/hooks/useActivityLogger';

interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

interface Transaction {
  id: string;
  wallet_id: string;
  amount: number;
  transaction_type: string;
  reference_id?: string;
  reference_type?: string;
  description?: string;
  created_at: string;
}

export const useJestCoin = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { logSystemActivity } = useActivityLogger();
  const [hasClaimedToday, setHasClaimedToday] = useState<boolean>(false);
  
  // Mock data for now - in a real app, this would be fetched from Supabase
  const mockWallet: Wallet = {
    id: user?.id || 'mock-wallet-id',
    user_id: user?.id || 'mock-user-id',
    balance: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      wallet_id: mockWallet.id,
      amount: 10,
      transaction_type: 'reward',
      description: 'Recompensa diária',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      wallet_id: mockWallet.id,
      amount: 50,
      transaction_type: 'deposit',
      description: 'Recompensa por compartilhamento',
      created_at: new Date(Date.now() - 86400000).toISOString() // yesterday
    },
    {
      id: '3',
      wallet_id: mockWallet.id,
      amount: -20,
      transaction_type: 'purchase',
      description: 'Compra na loja',
      created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    }
  ];
  
  // Mock query for wallet
  const { 
    data: wallet, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['wallet', user?.id],
    queryFn: async () => {
      // This is mock data - in real implementation this would fetch from Supabase
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      return mockWallet;
    },
    enabled: !!user,
  });
  
  // Mock query for transactions
  const { 
    data: transactions, 
    isLoading: isLoadingTransactions 
  } = useQuery({
    queryKey: ['transactions', wallet?.id],
    queryFn: async () => {
      // This is mock data - in real implementation this would fetch from Supabase
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      return mockTransactions;
    },
    enabled: !!wallet?.id,
  });
  
  // Mock mutation for adding balance
  const { mutate: addBalance, isPending: isAdding } = useMutation({
    mutationFn: async ({ amount, type, description }: { 
      amount: number, 
      type: string, 
      description?: string 
    }) => {
      // This is mock data - in real implementation this would update Supabase
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      // Log the activity
      await logSystemActivity(
        'add.jestcoin',
        {
          amount,
          type,
          description
        }
      );
      
      return {
        transaction: {
          id: Date.now().toString(),
          wallet_id: wallet?.id || '',
          amount,
          transaction_type: type,
          description: description || `${type} of ${amount} JestCoins`,
          created_at: new Date().toISOString()
        },
        wallet: {
          ...wallet,
          balance: (wallet?.balance || 0) + amount,
          updated_at: new Date().toISOString()
        }
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      console.error('Erro ao adicionar saldo:', error);
      toast.error('Erro ao adicionar saldo à carteira');
    }
  });
  
  // Mock function to check if daily reward is already claimed
  useEffect(() => {
    const checkDailyReward = async () => {
      // This is mock data - in real implementation this would check from Supabase
      if (!user || !wallet?.id) return;
      
      // Randomly set hasClaimedToday for demo purposes
      setHasClaimedToday(false);
    };
    
    checkDailyReward();
  }, [user, wallet?.id, transactions]);
  
  // Mock function to claim daily reward
  const { mutate: claimDailyReward, isPending: isClaiming } = useMutation({
    mutationFn: async () => {
      if (!user || !wallet) {
        throw new Error('Usuário não autenticado ou carteira não encontrada');
      }
      
      if (hasClaimedToday) {
        throw new Error('Você já coletou sua recompensa diária hoje');
      }
      
      // This is mock data - in real implementation this would update Supabase
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      return addBalance({ 
        amount: 10, 
        type: 'reward', 
        description: 'Recompensa diária' 
      });
    },
    onSuccess: () => {
      toast.success('Recompensa diária de 10 JestCoins coletada!');
      setHasClaimedToday(true);
    },
    onError: (error: Error) => {
      console.error('Erro ao coletar recompensa diária:', error);
      toast.error(error.message || 'Erro ao coletar recompensa diária');
    }
  });
  
  return {
    wallet,
    transactions,
    isLoading,
    isLoadingTransactions,
    error,
    addBalance,
    isAdding,
    claimDailyReward,
    isClaiming,
    hasClaimedToday,
  };
};
