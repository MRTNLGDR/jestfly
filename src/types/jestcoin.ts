
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
  transaction_type: string;
  reference_id?: string | null;
  reference_type?: string | null;
  description?: string | null;
  created_at: string;
}

export interface JestCoinContextType {
  wallet: Wallet | null;
  transactions: Transaction[] | null;
  isLoading: boolean;
  isLoadingTransactions: boolean;
  error: Error | null;
  addBalance: (params: AddBalanceParams) => void;
  isAdding: boolean;
  claimDailyReward: () => void;
  isClaiming: boolean;
  hasClaimedToday: boolean;
}

export interface AddBalanceParams {
  amount: number;
  type: string;
  description?: string;
  referenceId?: string;
  referenceType?: string;
}

export type TransactionType = 
  | 'deposit' 
  | 'withdraw' 
  | 'purchase' 
  | 'reward' 
  | 'airdrop' 
  | 'refund'
  | 'transfer'
  | 'other';
