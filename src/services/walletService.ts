import { supabase } from "@/integrations/supabase/client";
import { Wallet, Transaction, TransferJestCoinParams, TransactionType } from "@/types/wallet";
import { ProfileData } from "@/contexts/AuthContext";

export const walletService = {
  async getWallet(userId: string): Promise<Wallet | null> {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Erro ao buscar carteira:', error);
      return null;
    }

    return data;
  },

  async getTransactions(walletId: string, limit = 10): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('wallet_id', walletId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar transações:', error);
      return [];
    }

    return (data || []).map(transaction => ({
      ...transaction,
      transaction_type: transaction.transaction_type as TransactionType
    }));
  },

  async getTransactionsWithUserDetails(walletId: string, limit = 10): Promise<Transaction[]> {
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('wallet_id', walletId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar transações:', error);
      return [];
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

    return enhancedTransactions;
  },

  async transferJestCoin(userId: string, params: TransferJestCoinParams): Promise<{ success: boolean; message: string }> {
    try {
      const { data: recipientProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', params.recipient_id)
        .single();

      if (profileError || !recipientProfile) {
        return { 
          success: false, 
          message: 'Destinatário não encontrado' 
        };
      }

      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('id, balance')
        .eq('user_id', userId)
        .single();

      if (walletError || !wallet) {
        return { 
          success: false, 
          message: 'Carteira não encontrada' 
        };
      }

      if (wallet.balance < params.amount) {
        return { 
          success: false, 
          message: 'Saldo insuficiente' 
        };
      }

      const { data: recipientWallet, error: recipientWalletError } = await supabase
        .from('wallets')
        .select('id')
        .eq('user_id', params.recipient_id)
        .single();

      if (recipientWalletError || !recipientWallet) {
        return { 
          success: false, 
          message: 'Carteira do destinatário não encontrada' 
        };
      }

      const { error: updateSenderError } = await supabase
        .from('wallets')
        .update({ 
          balance: wallet.balance - params.amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', wallet.id);

      if (updateSenderError) {
        return { 
          success: false, 
          message: 'Erro ao atualizar saldo do remetente' 
        };
      }

      const { error: updateRecipientError } = await supabase
        .from('wallets')
        .update({ 
          balance: supabase.rpc('increment_value', { 
            row_id: recipientWallet.id,
            column_name: 'balance',
            increment_amount: params.amount
          }) as unknown as number,
          updated_at: new Date().toISOString()
        })
        .eq('id', recipientWallet.id);

      if (updateRecipientError) {
        await supabase
          .from('wallets')
          .update({ 
            balance: wallet.balance,
            updated_at: new Date().toISOString()
          })
          .eq('id', wallet.id);

        return { 
          success: false, 
          message: 'Erro ao atualizar saldo do destinatário' 
        };
      }

      await supabase.from('transactions').insert({
        wallet_id: wallet.id,
        amount: -params.amount,
        transaction_type: 'transfer_out',
        reference_id: params.recipient_id,
        reference_type: 'user',
        description: params.description || 'Transferência enviada'
      });

      await supabase.from('transactions').insert({
        wallet_id: recipientWallet.id,
        amount: params.amount,
        transaction_type: 'transfer_in',
        reference_id: userId,
        reference_type: 'user',
        description: params.description || 'Transferência recebida'
      });

      return { 
        success: true, 
        message: 'Transferência realizada com sucesso' 
      };
    } catch (error) {
      console.error('Erro na transferência:', error);
      return { 
        success: false, 
        message: 'Erro ao processar transferência' 
      };
    }
  }
};
