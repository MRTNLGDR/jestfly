
export enum LogLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  DEBUG = 'debug'
}

export enum LogSource {
  SYSTEM = 'system',
  CLIENT = 'client',
  SERVER = 'server',
  DATABASE = 'database',
  AUTH = 'auth'
}

export enum LogModule {
  AUTH = 'auth',
  USER = 'user',
  COMMUNITY = 'community',
  STORE = 'store',
  BOOKING = 'booking',
  SYSTEM = 'system'
}

export interface Log {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: LogSource;
  type: LogModule;
  message: string;
  userId?: string | null;
  metadata?: Record<string, any>;
}

// Database log structure from system_logs table
export interface SystemLogRecord {
  id: string;
  created_at: string;
  level: string;
  message: string;
  metadata: any;
}

// Compatibilidade retroativa
export type LogType = Log;
