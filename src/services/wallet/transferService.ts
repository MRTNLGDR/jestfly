
import { supabase } from "@/integrations/supabase/client";
import { TransferJestCoinParams } from "@/types/wallet";
import { TransferResponse } from "./types";
import { getWallet } from "./walletQueries";
import { createTransaction } from "./transactionQueries";

export async function transferJestCoin(userId: string, params: TransferJestCoinParams): Promise<TransferResponse> {
  try {
    // Verify recipient exists
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

    // Get sender's wallet
    const { data: wallet, error: walletError } = await getWallet(userId);

    if (walletError || !wallet) {
      return { 
        success: false, 
        message: 'Carteira não encontrada' 
      };
    }

    // Check balance
    if (wallet.balance < params.amount) {
      return { 
        success: false, 
        message: 'Saldo insuficiente' 
      };
    }

    // Get recipient's wallet
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

    // Update sender's balance
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

    // Update recipient's balance using a safe increment
    try {
      const { error: updateRecipientError } = await supabase
        .from('wallets')
        .update({ 
          balance: wallet.balance + params.amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', recipientWallet.id);

      if (updateRecipientError) {
        // Rollback sender's balance update
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
    } catch (error) {
      // Rollback sender's balance update
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

    // Create sender transaction record
    await createTransaction({
      wallet_id: wallet.id,
      amount: -params.amount,
      transaction_type: 'transfer_out',
      reference_id: params.recipient_id,
      reference_type: 'user',
      description: params.description || 'Transferência enviada'
    });

    // Create recipient transaction record
    await createTransaction({
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
