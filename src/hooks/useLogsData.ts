
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LogEntry, LogFilters } from '@/types/logs';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_FILTERS: LogFilters = {
  limit: 50,
  page: 1,
  activeTab: 'all',
  searchTerm: null,
  entityType: null,
  success: null,
  startDate: null,
  endDate: null
};

export const useLogsData = (hasAccess: boolean = false) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LogFilters>(DEFAULT_FILTERS);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const fetchLogs = async () => {
    try {
      if (!hasAccess) {
        setLogs([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      // Build the query
      let query = supabase
        .from('user_activity_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(filters.limit);

      // Apply filters
      if (filters.activeTab && filters.activeTab !== 'all') {
        query = query.eq('entity_type', filters.activeTab);
      }

      if (filters.entityType) {
        query = query.eq('entity_type', filters.entityType);
      }

      if (filters.success !== null) {
        query = query.eq('success', filters.success);
      }

      if (filters.searchTerm) {
        query = query.or(`action.ilike.%${filters.searchTerm}%,details.ilike.%${filters.searchTerm}%`);
      }

      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }

      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }

      // Execute the query
      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching logs:', error);
        toast({
          title: 'Erro ao carregar logs',
          description: error.message,
          variant: 'destructive',
        });
        setLogs([]);
        setTotalCount(0);
      } else {
        setLogs(data as LogEntry[]);
        setTotalCount(count || 0);
      }
    } catch (err) {
      console.error('Exception while fetching logs:', err);
      toast({
        title: 'Erro ao carregar logs',
        description: 'Ocorreu um erro ao buscar os logs de atividade.',
        variant: 'destructive',
      });
      setLogs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Update a single filter
  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handle search
  const handleSearch = () => {
    fetchLogs();
  };

  // Reset filters to default
  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Export logs to CSV
  const handleExport = () => {
    try {
      // Convert logs to CSV
      const headers = [
        'Data/Hora',
        'Ação',
        'Tipo',
        'Usuário',
        'Status',
        'IP',
        'Detalhes'
      ];

      const csvRows = logs.map(log => [
        new Date(log.created_at).toLocaleString('pt-BR'),
        log.action,
        log.entity_type || '-',
        log.user_id || '-',
        log.success === true ? 'Sucesso' : log.success === false ? 'Falha' : 'Info',
        log.ip_address || '-',
        log.details ? JSON.stringify(log.details) : '-'
      ]);

      const csvContent = [
        headers.join(','),
        ...csvRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `logs_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Exportação concluída',
        description: 'Logs exportados com sucesso.',
      });
    } catch (err) {
      console.error('Error exporting logs:', err);
      toast({
        title: 'Erro na exportação',
        description: 'Ocorreu um erro ao exportar os logs.',
        variant: 'destructive',
      });
    }
  };

  // Fetch logs when filters change or component mounts
  useEffect(() => {
    if (hasAccess) {
      fetchLogs();
    }
  }, [
    hasAccess,
    filters.activeTab,
    filters.limit,
    filters.page
  ]);

  return {
    logs,
    loading,
    filters,
    totalCount,
    updateFilter,
    handleSearch,
    handleReset,
    handleExport
  };
};
