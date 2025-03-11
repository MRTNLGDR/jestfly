
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical'
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
