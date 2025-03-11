
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useSystemLogs } from '@/hooks/logs/useSystemLogs';
import GlassHeader from '@/components/GlassHeader';
import Footer from '@/components/Footer';
import LogsFilter from '@/components/logs/LogsFilter';
import LogsTable from '@/components/logs/LogsTable';
import LogsTabs from '@/components/logs/LogsTabs';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const LogsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { 
    logs, 
    isLoading, 
    filters, 
    fetchLogs, 
    updateFilters,
    clearFilters 
  } = useSystemLogs();

  const isAdmin = profile?.profile_type === 'admin';

  // Load logs initially when component mounts
  useEffect(() => {
    if (user && isAdmin) {
      fetchLogs();
    }
  }, [user, isAdmin, fetchLogs]);

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-black">
        <GlassHeader />
        <main className="container mx-auto px-4 pt-24 pb-20">
          <h1 className="text-4xl font-light mb-6 text-gradient-primary">Logs Viewer</h1>
          <div className="glass-morphism p-8 rounded-lg text-center">
            <p className="text-white/70">Você não tem permissão para visualizar logs.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <GlassHeader />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-light text-gradient-primary">Logs Viewer</h1>
          <Button 
            onClick={() => fetchLogs()} 
            variant="outline"
            className="bg-black/30 border-white/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
        
        <LogsFilter
          currentFilters={filters}
          onFilterChange={updateFilters}
          onClearFilters={clearFilters}
        />
        
        <LogsTabs 
          defaultValue="system"
          tabValues={[
            { value: 'system', label: 'Logs do Sistema', count: logs.length },
            { value: 'user', label: 'Logs de Usuário', count: 0 },
          ]}
        >
          <LogsTable logs={logs} isLoading={isLoading} />
        </LogsTabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default LogsPage;
