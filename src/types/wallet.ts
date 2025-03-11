
import { ProfileData } from "@/contexts/AuthContext";

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  amount: number;
  transaction_type: TransactionType;
  reference_id?: string;
  reference_type?: string;
  description?: string;
  created_at: string;
  user?: ProfileData;
}

export type TransactionType = 
  | 'deposit'
  | 'withdrawal'
  | 'transfer_in'
  | 'transfer_out'
  | 'purchase'
  | 'reward'
  | 'airdrop';

export interface TransferJestCoinParams {
  amount: number;
  recipient_id: string;
  description?: string;
}
