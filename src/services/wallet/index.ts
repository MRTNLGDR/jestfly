
import { getWallet, updateWalletBalance } from './walletQueries';
import { getTransactions, getTransactionsWithUserDetails, createTransaction } from './transactionQueries';
import { transferJestCoin } from './transferService';
import { Wallet, Transaction, TransferJestCoinParams } from '@/types/wallet';

// Export a unified walletService object for backward compatibility
export const walletService = {
  getWallet: async (userId: string): Promise<Wallet | null> => {
    const { data } = await getWallet(userId);
    return data;
  },

  getTransactions: async (walletId: string, limit = 10): Promise<Transaction[]> => {
    const { data } = await getTransactions(walletId, limit);
    return data || [];
  },

  getTransactionsWithUserDetails: async (walletId: string, limit = 10): Promise<Transaction[]> => {
    const { data } = await getTransactionsWithUserDetails(walletId, limit);
    return data || [];
  },

  transferJestCoin: async (userId: string, params: TransferJestCoinParams) => {
    return transferJestCoin(userId, params);
  }
};

// Also export individual functions for more granular imports
export {
  getWallet,
  updateWalletBalance,
  getTransactions,
  getTransactionsWithUserDetails,
  createTransaction,
  transferJestCoin
};
