
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GlassCard } from '@/components/ui/glass-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ActivityLog, Log, LogsFilter, formatLogDate, getActionColor, getLogEntityDescription } from '@/types/logs';
import { CalendarIcon, Clock, Download, Filter, RefreshCw, User, Activity, Search, X, Database, Shield } from 'lucide-react';
import Loading from '@/components/ui/loading';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check } from 'lucide-react';
import { useSystemLogger } from '@/hooks/useActivityLogger';

const LogsViewer: React.FC = () => {
  const { logSystemEvent } = useSystemLogger();
  
  // Filter state
  const [filter, setFilter] = useState<LogsFilter>({
    search: '',
    dateRange: 'today',
    level: 'all',
    module: 'all',
    activeTab: 'user'
  });
  
  // Calendar state
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Build date filters based on the selected range
  const getDateFilter = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    switch (filter.dateRange) {
      case 'today':
        return {
          gte: today.toISOString(),
          lt: tomorrow.toISOString()
        };
      case 'yesterday': {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return {
          gte: yesterday.toISOString(),
          lt: today.toISOString()
        };
      }
      case 'last7days': {
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        return {
          gte: last7Days.toISOString(),
          lt: tomorrow.toISOString()
        };
      }
      case 'last30days': {
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        return {
          gte: last30Days.toISOString(),
          lt: tomorrow.toISOString()
        };
      }
      case 'custom':
        if (selectedDate) {
          const nextDay = new Date(selectedDate);
          nextDay.setDate(nextDay.getDate() + 1);
          return {
            gte: selectedDate.toISOString(),
            lt: nextDay.toISOString()
          };
        }
        return {};
      default:
        return {};
    }
  };
  
  // User activity logs query
  const { 
    data: activityLogs, 
    isLoading: isLoadingActivity,
    refetch: refetchActivity
  } = useQuery({
    queryKey: ['activity-logs', filter.search, filter.dateRange, selectedDate],
    queryFn: async () => {
      let query = supabase
        .from('user_activity_logs')
        .select(`
          *,
          profile:profiles(username, display_name, profile_type)
        `)
        .order('created_at', { ascending: false });
      
      // Apply date filter
      const dateFilter = getDateFilter();
      if (dateFilter.gte && dateFilter.lt) {
        query = query.gte('created_at', dateFilter.gte).lt('created_at', dateFilter.lt);
      }
      
      // Apply search filter if provided
      if (filter.search) {
        query = query.or(`
          action.ilike.%${filter.search}%,
          entity_type.ilike.%${filter.search}%,
          user_id.ilike.%${filter.search}%
        `);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform data to match ActivityLog interface
      const transformedData = data?.map(log => ({
        ...log,
        timestamp: log.created_at,
        profile: log.profile as {
          username?: string;
          display_name?: string;
          profile_type?: string;
        } | null,
        details: log.details as Record<string, any> | null,
        user_display_name: log.profile ? (log.profile as any).display_name : undefined,
        user_email: undefined // We don't have this in the query
      })) || [];
      
      return transformedData as ActivityLog[];
    }
  });
  
  // System logs query
  const { 
    data: systemLogs, 
    isLoading: isLoadingSystem,
    refetch: refetchSystem
  } = useQuery({
    queryKey: ['system-logs', filter.search, filter.dateRange, filter.level, filter.module, selectedDate],
    queryFn: async () => {
      let query = supabase
        .from('system_logs')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply date filter
      const dateFilter = getDateFilter();
      if (dateFilter.gte && dateFilter.lt) {
        query = query.gte('created_at', dateFilter.gte).lt('created_at', dateFilter.lt);
      }
      
      // Apply level filter if not 'all'
      if (filter.level !== 'all') {
        query = query.eq('level', filter.level);
      }
      
      // Apply search filter if provided
      if (filter.search) {
        query = query.or(`
          message.ilike.%${filter.search}%,
          metadata::text.ilike.%${filter.search}%
        `);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform data to match Log interface
      return (data || []).map(log => ({
        id: log.id,
        timestamp: log.created_at,
        level: log.level as 'info' | 'warning' | 'error' | 'debug',
        module: (log.metadata as any)?.module || 'system',
        message: log.message,
        details: log.metadata
      })) as Log[];
    }
  });
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setFilter(prev => ({ ...prev, activeTab: value }));
  };
  
  // Handle date range change
  const handleDateRangeChange = (value: string) => {
    setFilter(prev => ({ ...prev, dateRange: value }));
  };
  
  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setCalendarOpen(false);
    if (date) {
      setFilter(prev => ({ ...prev, dateRange: 'custom' }));
    }
  };
  
  // Handle level filter change
  const handleLevelChange = (value: string) => {
    setFilter(prev => ({ ...prev, level: value }));
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, search: e.target.value }));
  };
  
  // Clear search input
  const clearSearch = () => {
    setFilter(prev => ({ ...prev, search: '' }));
  };
  
  // Refresh logs data
  const handleRefresh = () => {
    if (filter.activeTab === 'user') {
      refetchActivity();
    } else {
      refetchSystem();
    }
    
    logSystemEvent('info', 'logs', 'Logs refreshed by admin');
  };
  
  // Export logs to CSV
  const exportLogs = () => {
    const logs = filter.activeTab === 'user' ? activityLogs : systemLogs;
    if (!logs || logs.length === 0) return;
    
    let csvContent: string;
    
    if (filter.activeTab === 'user') {
      // Headers for activity logs
      csvContent = 'ID,User ID,Action,Entity Type,Entity ID,Timestamp,Success,IP Address\n';
      
      // Data rows for activity logs
      csvContent += (logs as ActivityLog[]).map(log => {
        return `"${log.id}","${log.user_id}","${log.action}","${log.entity_type || ''}","${log.entity_id || ''}","${log.timestamp}","${log.success}","${log.ip_address || ''}"`;
      }).join('\n');
    } else {
      // Headers for system logs
      csvContent = 'ID,Timestamp,Level,Module,Message\n';
      
      // Data rows for system logs
      csvContent += (logs as Log[]).map(log => {
        return `"${log.id}","${log.timestamp}","${log.level}","${log.module}","${log.message}"`;
      }).join('\n');
    }
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `jestfly_${filter.activeTab}_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    // Trigger download and cleanup
    link.click();
    document.body.removeChild(link);
    
    logSystemEvent('info', 'logs', `${filter.activeTab} logs exported to CSV`);
  };
  
  // Log the fact that someone viewed the logs
  useEffect(() => {
    logSystemEvent('info', 'logs', 'Admin accessed logs page');
  }, []);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-white">Logs do Sistema</h1>
      
      <GlassCard className="mb-8">
        <Tabs defaultValue="user" value={filter.activeTab} onValueChange={handleTabChange}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <TabsList className="neo-blur">
              <TabsTrigger value="user" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Atividade de Usuários</span>
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>Logs do Sistema</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={exportLogs}
                className="text-white"
                disabled={
                  (filter.activeTab === 'user' && (!activityLogs || activityLogs.length === 0)) ||
                  (filter.activeTab === 'system' && (!systemLogs || systemLogs.length === 0))
                }
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>
          
          {/* Filter section */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                placeholder="Buscar nos logs..."
                value={filter.search}
                onChange={handleSearchChange}
                className="pl-10 pr-10 bg-black/30 border-white/10 text-white"
              />
              {filter.search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-white/50 hover:text-white" />
                </button>
              )}
            </div>
            
            <div className="w-full sm:w-auto">
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-black/30 border-white/10 text-white"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filter.dateRange === 'custom' && selectedDate
                      ? format(selectedDate, 'PPP', { locale: ptBR })
                      : filter.dateRange === 'today'
                      ? 'Hoje'
                      : filter.dateRange === 'yesterday'
                      ? 'Ontem'
                      : filter.dateRange === 'last7days'
                      ? 'Últimos 7 dias'
                      : 'Últimos 30 dias'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black/90 border-white/10" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                  <div className="border-t border-white/10 p-3">
                    <div className="space-y-2">
                      {['today', 'yesterday', 'last7days', 'last30days'].map((range) => (
                        <div 
                          key={range} 
                          className="flex items-center cursor-pointer p-2 hover:bg-white/10 rounded"
                          onClick={() => {
                            handleDateRangeChange(range);
                            setCalendarOpen(false);
                          }}
                        >
                          {filter.dateRange === range && <Check className="mr-2 h-4 w-4 text-green-500" />}
                          <span className={filter.dateRange === range ? 'text-white' : 'text-white/70'}>
                            {range === 'today' && 'Hoje'}
                            {range === 'yesterday' && 'Ontem'}
                            {range === 'last7days' && 'Últimos 7 dias'}
                            {range === 'last30days' && 'Últimos 30 dias'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            {filter.activeTab === 'system' && (
              <Select value={filter.level} onValueChange={handleLevelChange}>
                <SelectTrigger className="w-[180px] bg-black/30 border-white/10 text-white">
                  <SelectValue placeholder="Nível" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/10 text-white">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="info">Informação</SelectItem>
                  <SelectItem value="warning">Alerta</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          
          <TabsContent value="user" className="mt-0">
            {isLoadingActivity ? (
              <div className="flex justify-center p-12">
                <Loading text="Carregando logs de atividade..." />
              </div>
            ) : activityLogs?.length === 0 ? (
              <div className="text-center p-12 border border-dashed border-white/20 rounded">
                <Activity className="h-12 w-12 mx-auto text-white/30 mb-4" />
                <p className="text-white/70">Nenhum log de atividade encontrado para estes filtros.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {activityLogs?.map(log => (
                  <div 
                    key={log.id} 
                    className="bg-black/20 border border-white/10 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${getActionColor(log.action)}`}>
                            {log.action}
                          </span>
                          {log.success ? (
                            <Check className="h-4 w-4 text-green-400" />
                          ) : (
                            <X className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                        <div className="text-sm text-white/70 mt-1">
                          {log.profile?.display_name || log.user_display_name || log.user_id}
                          {log.profile && log.profile.username && (
                            <span className="text-white/50"> (@{log.profile.username})</span>
                          )}
                        </div>
                        {log.entity_type && (
                          <div className="text-xs text-white/50 mt-1">
                            {getLogEntityDescription(log)}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-xs text-white/50 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatLogDate(log.timestamp || log.created_at || '')}
                        </div>
                        {log.ip_address && (
                          <div className="text-xs text-white/30 mt-1 flex items-center">
                            <Shield className="h-3 w-3 mr-1" />
                            IP: {log.ip_address}
                          </div>
                        )}
                      </div>
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="mt-2 p-2 bg-black/30 rounded text-xs text-white/60">
                        <div className="font-mono overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="system" className="mt-0">
            {isLoadingSystem ? (
              <div className="flex justify-center p-12">
                <Loading text="Carregando logs do sistema..." />
              </div>
            ) : systemLogs?.length === 0 ? (
              <div className="text-center p-12 border border-dashed border-white/20 rounded">
                <Database className="h-12 w-12 mx-auto text-white/30 mb-4" />
                <p className="text-white/70">Nenhum log do sistema encontrado para estes filtros.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {systemLogs?.map(log => (
                  <div 
                    key={log.id} 
                    className="bg-black/20 border border-white/10 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            log.level === 'error' ? 'bg-red-950/50 text-red-400' :
                            log.level === 'warning' ? 'bg-amber-950/50 text-amber-400' :
                            log.level === 'debug' ? 'bg-blue-950/50 text-blue-400' :
                            'bg-green-950/50 text-green-400'
                          }`}>
                            {log.level.toUpperCase()}
                          </span>
                          <span className="text-white/80 font-medium">{log.message}</span>
                        </div>
                        <div className="text-sm text-white/50 mt-1">
                          Módulo: {log.module}
                        </div>
                      </div>
                      <div className="text-xs text-white/50 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatLogDate(log.timestamp)}
                      </div>
                    </div>
                    {log.details && (
                      <div className="mt-2 p-2 bg-black/30 rounded text-xs text-white/60">
                        <div className="font-mono overflow-x-auto">
                          {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </GlassCard>
    </div>
  );
};

export default LogsViewer;
