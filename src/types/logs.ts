
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

// Type guards to check log entry types
export const isSystemLogEntry = (log: AnyLogEntry): log is SystemLogEntry => {
  return 'level' in log && 'source' in log;
};

export const isLogEntry = (log: AnyLogEntry): log is LogEntry => {
  return 'action' in log && 'user_id' in log;
};
