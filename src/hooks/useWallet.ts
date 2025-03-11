
import { useState, useEffect } from 'react';
import { useAuth } from './auth/useAuth';
import { walletService } from '@/services/walletService';
import { Wallet, Transaction, TransferJestCoinParams } from '@/types/wallet';
import { toast } from 'sonner';

export const useWallet = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  const fetchWallet = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const walletData = await walletService.getWallet(user.id);
      setWallet(walletData);
    } catch (error) {
      console.error('Erro ao buscar carteira:', error);
      toast.error('Não foi possível carregar sua carteira');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!wallet) return;
    
    setIsLoading(true);
    try {
      const transactionsData = await walletService.getTransactionsWithUserDetails(wallet.id);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      toast.error('Não foi possível carregar suas transações');
    } finally {
      setIsLoading(false);
    }
  };

  const transferJestCoin = async (params: TransferJestCoinParams) => {
    if (!user) {
      toast.error('Você precisa estar logado para fazer transferências');
      return { success: false };
    }
    
    setIsTransferring(true);
    try {
      const result = await walletService.transferJestCoin(user.id, params);
      
      if (result.success) {
        toast.success(result.message);
        await fetchWallet();
        await fetchTransactions();
      } else {
        toast.error(result.message);
      }
      
      return result;
    } catch (error) {
      console.error('Erro na transferência:', error);
      toast.error('Erro ao processar transferência');
      return { success: false, message: 'Erro ao processar transferência' };
    } finally {
      setIsTransferring(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWallet();
    }
  }, [user]);

  useEffect(() => {
    if (wallet) {
      fetchTransactions();
    }
  }, [wallet]);

  return {
    wallet,
    transactions,
    isLoading,
    isTransferring,
    fetchWallet,
    fetchTransactions,
    transferJestCoin
  };
};
