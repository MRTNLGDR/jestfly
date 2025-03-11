
import { supabase } from "@/integrations/supabase/client";
import { Transaction, TransactionType } from "@/types/wallet";
import { WalletServiceResponse } from "./types";

export async function getTransactions(walletId: string, limit = 10): Promise<WalletServiceResponse<Transaction[]>> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('wallet_id', walletId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar transações:', error);
      return { data: [], error };
    }

    const typedTransactions = (data || []).map(transaction => ({
      ...transaction,
      transaction_type: transaction.transaction_type as TransactionType
    }));

    return { data: typedTransactions, error: null };
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return { data: [], error: error instanceof Error ? error : new Error('Unknown error') };
  }
}

export async function getTransactionsWithUserDetails(walletId: string, limit = 10): Promise<WalletServiceResponse<Transaction[]>> {
  try {
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('wallet_id', walletId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar transações:', error);
      return { data: [], error };
    }

    const enhancedTransactions = await Promise.all(
      (transactions || []).map(async (transaction) => {
        const transactionWithType = {
          ...transaction,
          transaction_type: transaction.transaction_type as TransactionType
        };

        if (
          (transactionWithType.transaction_type === 'transfer_in' || 
          transactionWithType.transaction_type === 'transfer_out') && 
          transactionWithType.reference_id
        ) {
          const { data: userData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', transactionWithType.reference_id)
            .single();
          
          return {
            ...transactionWithType,
            user: userData
          };
        }
        return transactionWithType;
      })
    );

    return { data: enhancedTransactions, error: null };
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return { data: [], error: error instanceof Error ? error : new Error('Unknown error') };
  }
}

export async function createTransaction(transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<WalletServiceResponse<void>> {
  try {
    const { error } = await supabase
      .from('transactions')
      .insert(transaction);

    if (error) {
      return { data: null, error };
    }
    
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
}
