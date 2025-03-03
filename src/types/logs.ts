// ActivityLog interface used in admin dashboard
export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  // Add created_at field to match Supabase data structure
  created_at?: string;
  timestamp: string;
  success: boolean;
  ip_address?: string;
  details?: Record<string, any>;
  user_email?: string;
  user_display_name?: string;
  // Add profile field to match Supabase joined data
  profile?: {
    username?: string;
    display_name?: string;
    profile_type?: string;
  };
}

// Log interface used in LogsPage
export interface Log {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  module: string;
  message: string;
  details?: string | Record<string, any>;
  user_email?: string;
}

// Filter interface for the logs page
export interface LogsFilter {
  search: string;
  dateRange: string;
  level: string;
  module: string;
  activeTab: string;
}

// Helper functions
export const formatLogDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};

export const getActionColor = (action: string): string => {
  if (action.includes('Login') || action.includes('criado') || action.includes('sucesso')) {
    return 'text-green-400';
  }
  if (action.includes('Falha') || action.includes('erro') || action.includes('falhou')) {
    return 'text-red-400';
  }
  if (action.includes('Tentativa') || action.includes('tentou')) {
    return 'text-amber-400';
  }
  return 'text-blue-400';
};

// Update this function to accept ActivityLog instead of just entity strings
export const getLogEntityDescription = (log: ActivityLog | { entity_type?: string, entity_id?: string }): string => {
  const entityType = log.entity_type;
  const entityId = log.entity_id;
  
  if (!entityType) return 'Sistema';
  
  switch (entityType) {
    case 'auth':
      return 'Autenticação';
    case 'profile':
      return `Perfil ${entityId ? `(${entityId.substring(0, 8)}...)` : ''}`;
    case 'resource':
      return `Recurso: ${entityId || 'desconhecido'}`;
    case 'post':
      return `Post ${entityId ? `(${entityId.substring(0, 8)}...)` : ''}`;
    case 'product':
      return `Produto ${entityId ? `(${entityId.substring(0, 8)}...)` : ''}`;
    default:
      return entityType.charAt(0).toUpperCase() + entityType.slice(1);
  }
};
