
export enum LogLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  DEBUG = 'debug'
}

export enum LogModule {
  AUTH = 'auth',
  USER = 'user',
  COMMUNITY = 'community',
  STORE = 'store',
  BOOKING = 'booking',
  SYSTEM = 'system'
}

export enum LogSource {
  SYSTEM = 'system',
  CLIENT = 'client',
  SERVER = 'server',
  DATABASE = 'database',
  AUTH = 'auth'
}

export type LogType = {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: LogSource;
  message: string;
  userId?: string;
  metadata?: Record<string, any>;
};

export type LogEntry = LogType; // Alias for backward compatibility
