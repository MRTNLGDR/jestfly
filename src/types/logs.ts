
export interface LogEntry {
  id: string;
  user_id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, any> | null;
  success: boolean | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface LogFilters {
  limit: number;
  page: number;
  activeTab: string;
  searchTerm: string | null;
  entityType: string | null;
  success: boolean | null;
  startDate: string | null;
  endDate: string | null;
}
