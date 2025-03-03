// ActivityLog interface used in admin dashboard
export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  timestamp: string;
  success: boolean;
  ip_address?: string;
  details?: Record<string, any>;
  user_email?: string;
  user_display_name?: string;
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

export const getLogEntityDescription = (entityType?: string, entityId?: string): string => {
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
