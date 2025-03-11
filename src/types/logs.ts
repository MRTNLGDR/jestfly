
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
  userId?: string;
  metadata?: Record<string, any>;
}

export type LogType = Log; // Alias for backward compatibility
