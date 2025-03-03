
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActivityLog, LogsFilterState, formatLogDate } from '@/types/logs';

export const useLogsData = (isAdminOrCollaborator: boolean) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LogsFilterState>({
    searchTerm: '',
    dateFrom: undefined,
    dateTo: undefined,
    actionFilter: '',
    successFilter: null,
    activeTab: 'all'
  });

  const fetchLogs = async () => {
    if (!isAdminOrCollaborator) return;
    
    setLoading(true);
    try {
      // Base query
      let query = supabase
        .from('user_activity_logs')
        .select(`
          *,
          profile:profiles(username, display_name, profile_type)
        `)
        .order('created_at', { ascending: false });
      
      // Apply filters
      if (filters.activeTab !== 'all') {
        query = query.eq('action', filters.activeTab);
      }
      
      if (filters.actionFilter) {
        query = query.eq('action', filters.actionFilter);
      }
      
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom.toISOString());
      }
      
      if (filters.dateTo) {
        // Adjust to end of day
        const endOfDay = new Date(filters.dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        query = query.lte('created_at', endOfDay.toISOString());
      }
      
      if (filters.successFilter !== null) {
        query = query.eq('success', filters.successFilter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Erro ao buscar logs:', error);
        return;
      }
      
      // Filter by search term (client-side)
      let filteredData = data || [];
      if (filters.searchTerm) {
        const lowerSearchTerm = filters.searchTerm.toLowerCase();
        filteredData = filteredData.filter(log => {
          // Use type assertion for profile object to avoid TypeScript errors
          const profileObj: any = log.profile && typeof log.profile === 'object' ? log.profile : null;
          
          // Check if properties exist before accessing
          const usernameMatch = profileObj && 
            typeof profileObj === 'object' &&
            profileObj.username && 
            String(profileObj.username).toLowerCase().includes(lowerSearchTerm);
          
          const displayNameMatch = profileObj && 
            typeof profileObj === 'object' &&
            profileObj.display_name && 
            String(profileObj.display_name).toLowerCase().includes(lowerSearchTerm);
          
          return log.action.toLowerCase().includes(lowerSearchTerm) ||
            usernameMatch ||
            displayNameMatch ||
            (log.entity_type && log.entity_type.toLowerCase().includes(lowerSearchTerm)) ||
            (log.ip_address && log.ip_address.includes(filters.searchTerm));
        });
      }
      
      // Safe type conversion with proper null checks
      const safeData = filteredData.map(log => {
        // Cast to any first to safely access properties
        const profileObj: any = log.profile && typeof log.profile === 'object' ? log.profile : null;
        
        const profileData = profileObj ? {
          username: profileObj.username ? String(profileObj.username) : undefined,
          display_name: profileObj.display_name ? String(profileObj.display_name) : undefined,
          profile_type: profileObj.profile_type ? String(profileObj.profile_type) : undefined
        } : null;
        
        return {
          ...log,
          profile: profileData,
          details: log.details as Record<string, any> | null
        };
      }) as ActivityLog[];
      
      setLogs(safeData);
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update filters
  const updateFilter = (key: keyof LogsFilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    fetchLogs();
  };

  const handleReset = () => {
    setFilters({
      searchTerm: '',
      dateFrom: undefined,
      dateTo: undefined,
      actionFilter: '',
      successFilter: null,
      activeTab: 'all'
    });
  };

  // Export logs as CSV
  const handleExport = () => {
    // Create CSV from filtered logs
    const headers = ['ID', 'Usuário', 'Ação', 'Tipo', 'Data', 'IP', 'Sucesso', 'Detalhes'];
    const csvContent = [
      headers.join(','),
      ...logs.map(log => [
        log.id,
        log.profile?.display_name || log.user_id,
        log.action,
        log.entity_type || '',
        formatLogDate(log.created_at),
        log.ip_address || '',
        log.success ? 'Sim' : 'Não',
        JSON.stringify(log.details || {})
      ].join(','))
    ].join('\n');
    
    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (isAdminOrCollaborator) {
      fetchLogs();
    }
  }, [isAdminOrCollaborator, filters.activeTab, filters.dateFrom, filters.dateTo, filters.actionFilter, filters.successFilter]);

  return {
    logs,
    loading,
    filters,
    updateFilter,
    handleSearch,
    handleReset,
    handleExport,
    fetchLogs
  };
};
