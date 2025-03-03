
export interface Log {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  module: string;
  message: string;
  details?: string;
  user_id?: string;
  user_email?: string;
}

export interface LogsFilter {
  search: string;
  dateRange: string;
  level: string;
  module: string;
  activeTab: string;
}
