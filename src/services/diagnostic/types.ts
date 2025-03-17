
// Tipos para o serviço de diagnóstico
import { User } from '@supabase/supabase-js';

export interface DiagnosticResult {
  success: boolean;
  connectivity?: {
    success: boolean;
    error: string | null;
    duration_ms?: number;
    timestamp: string;
  };
  auth_user_exists?: boolean;
  user_data?: any;
  errors?: {
    profile_error?: string | null;
    [key: string]: any;
  };
  error?: string;
  timestamp: string;
}

export interface ConnectivityTestResult {
  success: boolean;
  error: string | null;
  duration_ms?: number;
  timestamp: string;
}

export interface ProfileFixResult {
  success: boolean;
  message: string;
  profile?: any;
  error?: string;
}
