
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

export interface ActivityLog extends LogEntry {
  timestamp?: string;
  profile?: {
    username?: string;
    display_name?: string;
    profile_type?: string;
  } | null;
  user_display_name?: string;
  user_email?: string;
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

// Format dates for display
export const formatLogDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (e) {
    return dateString;
  }
};

// Get color based on action type
export const getActionColor = (action: string): string => {
  if (action.startsWith('create') || action.includes('login')) {
    return 'text-green-400';
  } else if (action.startsWith('update') || action.startsWith('edit')) {
    return 'text-blue-400';
  } else if (action.startsWith('delete') || action.includes('logout')) {
    return 'text-red-400';
  } else if (action.includes('view') || action.includes('access')) {
    return 'text-purple-400';
  } else {
    return 'text-white';
  }
};

// Get log entity description
export const getLogEntityDescription = (log: ActivityLog): string => {
  if (!log.entity_type) return '';
  
  const entityType = log.entity_type;
  const entityId = log.entity_id ? log.entity_id.substring(0, 8) + '...' : 'unknown';
  
  return `${entityType} (${entityId})`;
};
