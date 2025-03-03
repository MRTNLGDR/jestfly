
import { Json } from '@/integrations/supabase/types';

export interface LogProfile {
  username?: string;
  display_name?: string;
  profile_type?: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  success: boolean;
  profile?: LogProfile | null;
}

export interface LogsFilterState {
  searchTerm: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  actionFilter: string;
  successFilter: boolean | null;
  activeTab: string;
}

// Add helper functions for log formatting
export const formatLogDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('pt-BR');
};

export const getActionColor = (action: string): string => {
  if (action.includes('login')) return 'text-blue-400';
  if (action.includes('create') || action.includes('add')) return 'text-green-400';
  if (action.includes('delete') || action.includes('remove')) return 'text-red-400';
  if (action.includes('update') || action.includes('edit')) return 'text-yellow-400';
  return 'text-white';
};

export const getLogEntityDescription = (log: ActivityLog): string => {
  if (!log.entity_type) return '';
  return `${log.entity_type} ${log.entity_id ? `#${log.entity_id.substring(0, 8)}` : ''}`;
};
