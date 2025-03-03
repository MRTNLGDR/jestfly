
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
