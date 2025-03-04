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

// ActivityLog interface for admin dashboard
export interface ActivityLog {
  id: string;
  created_at: string;
  timestamp?: string;
  user_id?: string;
  action: string;
  details: Record<string, any> | null;
  ip_address?: string;
  user_agent?: string;
  entity_type?: string;
  entity_id?: string;
  success?: boolean;
  profile?: {
    username?: string;
    display_name?: string;
    profile_type?: string;
  } | null;
  user_display_name?: string;
  user_email?: string;
}

// Helper function to format log dates
export const formatLogDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return 'Data inválida';
  
  // Format as "DD/MM/YYYY, HH:MM:SS"
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// Helper function to get appropriate color for action type
export const getActionColor = (action: string): string => {
  const actionLower = action.toLowerCase();
  
  if (actionLower.includes('create') || actionLower.includes('add') || actionLower.includes('register')) {
    return 'text-green-400';
  }
  
  if (actionLower.includes('update') || actionLower.includes('edit') || actionLower.includes('change')) {
    return 'text-blue-400';
  }
  
  if (actionLower.includes('delete') || actionLower.includes('remove')) {
    return 'text-red-400';
  }
  
  if (actionLower.includes('login') || actionLower.includes('access')) {
    return 'text-purple-400';
  }
  
  if (actionLower.includes('error') || actionLower.includes('fail')) {
    return 'text-amber-400';
  }
  
  return 'text-white';
};

// Helper function to get a description for the log entity
export const getLogEntityDescription = (log: ActivityLog | LogEntry): string => {
  if (!log.entity_type || !log.entity_id) return '';
  
  // Format based on entity type
  switch (log.entity_type) {
    case 'user':
    case 'profile':
      return `Usuário: ${log.entity_id}`;
    case 'post':
      return `Post: ${log.entity_id}`;
    case 'comment':
      return `Comentário: ${log.entity_id}`;
    case 'product':
      return `Produto: ${log.entity_id}`;
    case 'order':
      return `Pedido: ${log.entity_id}`;
    case 'booking':
      return `Reserva: ${log.entity_id}`;
    case 'demo':
      return `Demo: ${log.entity_id}`;
    default:
      return `${log.entity_type}: ${log.entity_id}`;
  }
};
