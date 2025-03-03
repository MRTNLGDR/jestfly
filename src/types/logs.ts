
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

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  success: boolean;
  ip_address?: string;
  created_at: string;
  profile?: {
    username?: string;
    display_name?: string;
    profile_type?: string;
  } | null;
  details?: Record<string, any> | null;
}

// Utility functions for activity logs
export const formatLogDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `${diffMins}m atrás`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h atrás`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d atrás`;
  
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getActionColor = (action: string): string => {
  const actionLower = action.toLowerCase();
  
  if (actionLower.includes('login') || actionLower.includes('entrar')) return 'text-blue-400';
  if (actionLower.includes('criar') || actionLower.includes('novo') || actionLower.includes('adicionar')) return 'text-green-400';
  if (actionLower.includes('atualizar') || actionLower.includes('editar') || actionLower.includes('modificar')) return 'text-yellow-400';
  if (actionLower.includes('excluir') || actionLower.includes('remover') || actionLower.includes('deletar')) return 'text-red-400';
  if (actionLower.includes('erro') || actionLower.includes('falha')) return 'text-red-400';
  
  return 'text-purple-400';
};

export const getLogEntityDescription = (log: ActivityLog): string => {
  if (!log.entity_type) return '';
  
  let description = `${log.entity_type}`;
  if (log.entity_id) description += ` #${log.entity_id}`;
  
  // Add more specific descriptions based on entity_type if needed
  if (log.entity_type === 'post' && log.details?.title) {
    description += `: "${log.details.title}"`;
  }
  
  return description;
};
