
export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug'
}

export enum LogSource {
  CLIENT = 'client',
  SERVER = 'server',
  SYSTEM = 'system',
  DATABASE = 'database',
  AUTHENTICATION = 'authentication'
}

export interface LogType {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: LogSource;
  message: string;
  userId: string | null;
  metadata: Record<string, any>;
}
