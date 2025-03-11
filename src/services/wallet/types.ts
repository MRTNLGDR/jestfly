
import { ProfileData } from "@/contexts/AuthContext";
import { Transaction, TransactionType, TransferJestCoinParams, Wallet } from "@/types/wallet";

export interface WalletServiceResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface TransferResponse {
  success: boolean;
  message: string;
}
