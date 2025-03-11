
import { supabase } from "@/integrations/supabase/client";
import { Wallet, Transaction, TransferJestCoinParams } from "@/types/wallet";
import { ProfileData } from "@/contexts/AuthContext";

export const walletService = {
  /**
   * Busca o saldo atual da carteira do usuário
   */
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

  /**
   * Busca o histórico de transações do usuário
   */
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

    return data || [];
  },

  /**
   * Busca transações com detalhes de usuário
   */
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

    // Para cada transação de transferência, buscar detalhes do usuário
    const enhancedTransactions = await Promise.all(
      (transactions || []).map(async (transaction) => {
        // Buscar detalhes apenas para transferências onde temos um ID de referência
        if (
          (transaction.transaction_type === 'transfer_in' || 
          transaction.transaction_type === 'transfer_out') && 
          transaction.reference_id
        ) {
          const { data: userData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', transaction.reference_id)
            .single();
          
          return {
            ...transaction,
            user: userData
          };
        }
        return transaction;
      })
    );

    return enhancedTransactions;
  },

  /**
   * Transfere JestCoins para outro usuário
   */
  async transferJestCoin(
    userId: string,
    params: TransferJestCoinParams
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Verifica se o destinatário existe
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

      // Verifica se o usuário tem saldo suficiente
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

      // Busca a carteira do destinatário
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

      // Realiza a transferência (RPC via edge function seria o ideal aqui)
      // Mas vamos fazer diretamente para simplicidade
      
      // 1. Subtrai do remetente
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

      // 2. Adiciona ao destinatário  
      const { error: updateRecipientError } = await supabase
        .from('wallets')
        .update({ 
          balance: supabase.rpc('increment_value', { 
            row_id: recipientWallet.id,
            column_name: 'balance',
            increment_amount: params.amount
          }),
          updated_at: new Date().toISOString()
        })
        .eq('id', recipientWallet.id);

      if (updateRecipientError) {
        // Desfaz a transação se houver erro
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

      // 3. Registra as transações
      // Transação de saída
      await supabase.from('transactions').insert({
        wallet_id: wallet.id,
        amount: -params.amount,
        transaction_type: 'transfer_out',
        reference_id: params.recipient_id,
        reference_type: 'user',
        description: params.description || 'Transferência enviada'
      });

      // Transação de entrada
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
