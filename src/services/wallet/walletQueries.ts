
import { supabase } from "@/integrations/supabase/client";
import { Wallet } from "@/types/wallet";
import { WalletServiceResponse } from "./types";

export async function getWallet(userId: string): Promise<WalletServiceResponse<Wallet>> {
  try {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Erro ao buscar carteira:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Erro ao buscar carteira:', error);
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
}

export async function updateWalletBalance(walletId: string, balance: number): Promise<WalletServiceResponse<void>> {
  try {
    const { error } = await supabase
      .from('wallets')
      .update({ 
        balance,
        updated_at: new Date().toISOString()
      })
      .eq('id', walletId);

    if (error) {
      return { data: null, error };
    }
    
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
}
