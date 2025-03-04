
export interface BaseLogEntry {
  id: string;
  timestamp: string;
  message: string;
}

export interface LogEntry extends BaseLogEntry {
  user_id: string;
  action: string;
  resource?: string;
  resource_id?: string;
}

export interface SystemLogEntry extends BaseLogEntry {
  level: 'info' | 'warning' | 'error';
  source: 'system' | 'api' | 'auth' | 'database' | string;
  metadata?: Record<string, any>;
}

export type AnyLogEntry = LogEntry | SystemLogEntry;
