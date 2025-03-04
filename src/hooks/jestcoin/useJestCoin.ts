
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/auth/useAuthState';
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
  const { user } = useAuthState();
  const queryClient = useQueryClient();
  const { logActivity } = useActivityLogger();
  const [hasClaimedToday, setHasClaimedToday] = useState<boolean>(false);
  
  // Buscar carteira do usuário
  const { 
    data: wallet, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['wallet', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // Verificar se o usuário já tem uma carteira
      const { data: existingWallet, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (walletError && walletError.code !== 'PGRST116') {
        throw walletError;
      }
      
      // Se não tiver uma carteira, criar uma nova
      if (!existingWallet) {
        const { data: newWallet, error: createError } = await supabase
          .from('wallets')
          .insert({
            user_id: user.id,
            balance: 0
          })
          .select()
          .single();
        
        if (createError) throw createError;
        return newWallet as Wallet;
      }
      
      return existingWallet as Wallet;
    },
    enabled: !!user,
  });
  
  // Buscar transações do usuário
  const { 
    data: transactions, 
    isLoading: isLoadingTransactions 
  } = useQuery({
    queryKey: ['transactions', wallet?.id],
    queryFn: async () => {
      if (!wallet?.id) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('wallet_id', wallet.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!wallet?.id,
  });
  
  // Mutation para adicionar saldo à carteira
  const { mutate: addBalance, isPending: isAdding } = useMutation({
    mutationFn: async ({ amount, type, description, referenceId, referenceType }: { 
      amount: number, 
      type: string, 
      description?: string,
      referenceId?: string,
      referenceType?: string
    }) => {
      if (!user || !wallet) {
        throw new Error('Usuário não autenticado ou carteira não encontrada');
      }
      
      // Criar transação
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          wallet_id: wallet.id,
          amount,
          transaction_type: type,
          reference_id: referenceId,
          reference_type: referenceType,
          description: description || `${type} de ${amount} JestCoins`
        })
        .select()
        .single();
      
      if (transactionError) throw transactionError;
      
      // Atualizar saldo da carteira
      const { data: updatedWallet, error: updateError } = await supabase
        .from('wallets')
        .update({ 
          balance: wallet.balance + amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', wallet.id)
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      // Log da atividade
      logActivity({
        action: 'add.balance',
        entity_type: 'wallets',
        entity_id: wallet.id,
        details: { amount, type },
      });
      
      return { transaction, wallet: updatedWallet };
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
  
  // Verificar se o usuário já coletou a recompensa diária
  useEffect(() => {
    const checkDailyReward = async () => {
      if (!user || !wallet?.id) return;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('wallet_id', wallet.id)
        .eq('transaction_type', 'reward')
        .ilike('description', '%recompensa diária%')
        .gte('created_at', today.toISOString())
        .limit(1);
      
      if (error) {
        console.error('Erro ao verificar recompensa diária:', error);
        return;
      }
      
      setHasClaimedToday(data && data.length > 0);
    };
    
    checkDailyReward();
  }, [user, wallet?.id, transactions]);
  
  // Função para coletar recompensa diária
  const { mutate: claimDailyReward, isPending: isClaiming } = useMutation({
    mutationFn: async () => {
      if (!user || !wallet) {
        throw new Error('Usuário não autenticado ou carteira não encontrada');
      }
      
      if (hasClaimedToday) {
        throw new Error('Você já coletou sua recompensa diária hoje');
      }
      
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
