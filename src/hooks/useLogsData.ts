import { useState, useEffect, useCallback } from 'react';
import { Log, LogsFilter } from '@/types/logs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mock data for demo purposes
const mockLogs: Log[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    level: 'info',
    module: 'auth',
    message: 'Usuário realizou login com sucesso',
    user_email: 'usuario@jestfly.com'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    level: 'warning',
    module: 'system',
    message: 'Tentativa de acesso a recurso restrito',
    user_email: 'usuario@jestfly.com'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    level: 'error',
    module: 'api',
    message: 'Falha na conexão com serviço externo',
    details: 'Timeout após 30 segundos'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    level: 'debug',
    module: 'admin',
    message: 'Atualização de configurações do sistema',
    user_email: 'admin@jestfly.com'
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    level: 'info',
    module: 'user',
    message: 'Perfil de usuário atualizado',
    user_email: 'usuario@jestfly.com'
  }
];

export const useLogsData = (hasAccess: boolean) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LogsFilter>({
    search: '',
    dateRange: 'all',
    level: 'all',
    module: 'all',
    activeTab: 'all'
  });

  const fetchLogs = useCallback(async () => {
    if (!hasAccess) return;
    
    setLoading(true);
    
    try {
      // In a real application, we would fetch from Supabase or another data source
      // const { data, error } = await supabase
      //   .from('logs')
      //   .select('*')
      //   .order('timestamp', { ascending: false });
      
      // if (error) throw error;
      
      // For demo purposes, we're using mock data
      setTimeout(() => {
        setLogs(mockLogs);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Erro ao carregar logs do sistema');
      setLoading(false);
    }
  }, [hasAccess]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    // In a real application, this would trigger a new fetch with the search parameters
    toast.info('Buscando logs...');
    
    // Mock filtering based on search term
    const filteredLogs = mockLogs.filter(log => 
      log.message.toLowerCase().includes(filters.search.toLowerCase()) ||
      (log.user_email && log.user_email.toLowerCase().includes(filters.search.toLowerCase()))
    );
    
    setLogs(filteredLogs);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      dateRange: 'all',
      level: 'all',
      module: 'all',
      activeTab: 'all'
    });
    
    fetchLogs();
  };

  const handleExport = () => {
    // In a real application, this would generate a CSV file
    toast.success('Logs exportados com sucesso');
    
    // Mock export - in a real app, you'd generate a file for download
    console.log('Exporting logs:', logs);
  };

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
