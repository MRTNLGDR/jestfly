import React, { useEffect } from 'react';
import { GlassCard } from '../components/ui/glass-card';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/ui/loading';
import LogsFilter from '../components/logs/LogsFilter';
import LogsTable from '../components/logs/LogsTable';
import LogsTabs from '../components/logs/LogsTabs';
import { useLogsData } from '../hooks/useLogsData';
import { useActivityLogger } from '../hooks/useActivityLogger';

const LogsViewer = () => {
  const { profile } = useAuth();
  const { logSystemActivity } = useActivityLogger();
  
  const isAdminOrCollaborator = profile?.profile_type === 'admin' || profile?.profile_type === 'collaborator';
  
  const { 
    logs, 
    loading, 
    filters: logFilters, 
    updateFilter, 
    handleSearch, 
    handleReset, 
    handleExport 
  } = useLogsData(isAdminOrCollaborator);

  const filters = {
    search: logFilters.searchTerm || '',
    type: logFilters.entityType || '',
    dateRange: '',
    activeTab: logFilters.activeTab || 'activity'
  };
  
  useEffect(() => {
    if (isAdminOrCollaborator) {
      logSystemActivity('Visualizou logs do sistema');
    }
  }, [isAdminOrCollaborator, logSystemActivity]);
  
  if (!isAdminOrCollaborator) {
    return (
      <div className="container mx-auto py-12 px-4">
        <GlassCard className="p-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Acesso Restrito</h1>
          <p className="text-white/70">Você não tem permissão para acessar esta página.</p>
        </GlassCard>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">
          Visualizador de Logs
        </h1>
        
        <LogsFilter 
          filters={filters}
          onUpdateFilter={updateFilter}
          onSearch={handleSearch}
          onReset={handleReset}
          onExport={handleExport}
        />
        
        <LogsTabs 
          activeTab={filters.activeTab}
          onTabChange={(value) => updateFilter('activeTab', value)}
        >
          <GlassCard className="overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <Loading text="Carregando logs..." />
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center p-12">
                <p className="text-white/70">Nenhum log encontrado.</p>
              </div>
            ) : (
              <LogsTable 
                logs={logs}
                type={filters.activeTab as 'activity' | 'system'}
                onViewDetails={(log) => console.log('View details:', log)}
              />
            )}
          </GlassCard>
        </LogsTabs>
      </div>
    </div>
  );
};

export default LogsViewer;
