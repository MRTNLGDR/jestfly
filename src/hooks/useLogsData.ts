
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LogEntry, SystemLogEntry, LogFilters } from '@/types/logs';

export const useLogsData = (isAuthorized: boolean) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros padrão
  const [filters, setFilters] = useState<LogFilters>({
    activeTab: 'activity',
    searchTerm: null,
    entityType: null,
    success: null,
    startDate: null,
    endDate: null,
    page: 1,
    limit: 50
  });
  
  // Função para atualizar filtros
  const updateFilter = useCallback((key: keyof LogFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);
  
  // Buscar logs com os filtros atuais
  const fetchLogs = useCallback(async () => {
    if (!isAuthorized) return;
    
    setLoading(true);
    
    try {
      let query;
      
      // Determinar qual tabela consultar com base na aba ativa
      if (filters.activeTab === 'activity') {
        query = supabase
          .from('user_activity_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(filters.limit);
      } else if (filters.activeTab === 'system' || filters.activeTab === 'errors') {
        query = supabase
          .from('system_logs')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (filters.activeTab === 'errors') {
          query = query.eq('level', 'error');
        }
        
        query = query.limit(filters.limit);
      }
      
      // Aplicar filtros se houver
      if (filters.searchTerm) {
        if (filters.activeTab === 'activity') {
          query = query.or(`action.ilike.%${filters.searchTerm}%,entity_type.ilike.%${filters.searchTerm}%`);
        } else {
          query = query.or(`message.ilike.%${filters.searchTerm}%,level.ilike.%${filters.searchTerm}%`);
        }
      }
      
      if (filters.entityType && filters.activeTab === 'activity') {
        query = query.eq('entity_type', filters.entityType);
      }
      
      if (filters.success !== null && filters.activeTab === 'activity') {
        query = query.eq('success', filters.success);
      }
      
      // Executar a consulta
      const { data, error } = await query;
      
      if (error) {
        console.error('Erro ao buscar logs:', error);
        setLogs([]);
      } else {
        setLogs(data as any);
      }
    } catch (error) {
      console.error('Exceção ao buscar logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthorized, filters]);
  
  // Efeito para buscar logs quando os filtros mudarem
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);
  
  // Função para limpar filtros
  const handleReset = useCallback(() => {
    setFilters({
      ...filters,
      searchTerm: null,
      entityType: null,
      success: null,
      startDate: null,
      endDate: null,
      page: 1,
    });
  }, [filters]);
  
  // Função para buscar com os filtros atuais
  const handleSearch = useCallback(() => {
    fetchLogs();
  }, [fetchLogs]);
  
  // Função para exportar logs como CSV
  const handleExport = useCallback(() => {
    if (logs.length === 0) return;
    
    // Determinar cabeçalhos com base no tipo de log
    let headers: string[];
    let csvData: any[];
    
    if (filters.activeTab === 'activity') {
      headers = ['Data', 'Ação', 'Usuário', 'Entidade', 'Status', 'Detalhes'];
      csvData = logs.map((log: LogEntry) => [
        new Date(log.created_at).toLocaleString(),
        log.action,
        log.user_id || 'Sistema',
        log.entity_type && log.entity_id ? `${log.entity_type}: ${log.entity_id}` : '',
        log.success === undefined ? '-' : log.success ? 'Sucesso' : 'Falha',
        JSON.stringify(log.details)
      ]);
    } else {
      headers = ['Data', 'Nível', 'Mensagem', 'Metadados'];
      csvData = logs.map((log: SystemLogEntry) => [
        new Date(log.created_at).toLocaleString(),
        log.level,
        log.message,
        JSON.stringify(log.metadata)
      ]);
    }
    
    // Criar o conteúdo CSV
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    // Criar o arquivo para download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `logs-${filters.activeTab}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [logs, filters.activeTab]);
  
  return {
    logs,
    loading,
    filters,
    updateFilter,
    handleSearch,
    handleReset,
    handleExport
  };
};
