
export interface LogEntry {
  id: string;
  created_at: string;
  user_id?: string;
  action: string;
  details: Record<string, any> | null;
  ip_address?: string;
  user_agent?: string;
  entity_type?: string;
  entity_id?: string;
  success?: boolean;
}

export interface LogFilters {
  activeTab: string;
  searchTerm: string | null;
  entityType: string | null;
  success: boolean | null;
  startDate: string | null;
  endDate: string | null;
  page: number;
  limit: number;
}

export interface SystemLogEntry {
  id: string;
  created_at: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  metadata: Record<string, any> | null;
}
