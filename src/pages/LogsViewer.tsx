
import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';
import LogsFilter from '@/components/logs/LogsFilter';
import LogsTable from '@/components/logs/LogsTable';
import LogsTabs from '@/components/logs/LogsTabs';
import { useLogsData } from '@/hooks/useLogsData';
import { useActivityLogger } from '@/hooks/useActivityLogger';

const LogsViewer = () => {
  const { profile } = useAuth();
  const { logSystemActivity } = useActivityLogger();
  
  // Check if user is admin or collaborator
  const isAdminOrCollaborator = profile?.profile_type === 'admin' || profile?.profile_type === 'collaborator';
  
  // Use our custom hook to fetch and manage logs data
  const { 
    logs, 
    loading, 
    filters, 
    updateFilter, 
    handleSearch, 
    handleReset, 
    handleExport 
  } = useLogsData(isAdminOrCollaborator);
  
  // Log access to this page
  useEffect(() => {
    if (isAdminOrCollaborator) {
      logSystemActivity('Visualizou logs do sistema');
    }
  }, [isAdminOrCollaborator, logSystemActivity]);
  
  // Render access denied message if not admin or collaborator
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
              <LogsTable logs={logs} />
            )}
          </GlassCard>
        </LogsTabs>
      </div>
    </div>
  );
};

export default LogsViewer;
