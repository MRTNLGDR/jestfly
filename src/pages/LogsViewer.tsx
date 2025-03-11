
import React, { useEffect } from 'react';
import { useAuth } from '../hooks/auth/useAuth';
import { useSystemLogs } from '../hooks/logs/useSystemLogs';
import GlassHeader from '../components/GlassHeader';
import Footer from '../components/Footer';
import LogsFilter from '../components/logs/LogsFilter';
import LogsTable from '../components/logs/LogsTable';
import LogsTabs from '../components/logs/LogsTabs';
import { Button } from '../components/ui/button';
import { RefreshCw } from 'lucide-react';

const LogsViewer: React.FC = () => {
  const { user, profile } = useAuth();
  const { logs, isLoading, filters, fetchLogs, updateFilters } = useSystemLogs();

  const isAdmin = profile?.profile_type === 'admin';

  // Fetch logs on component mount
  useEffect(() => {
    if (user && isAdmin) {
      fetchLogs();
    }
  }, [user, isAdmin]);

  // Effect for filter changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user && isAdmin) {
        fetchLogs();
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters]);

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-black">
        <GlassHeader />
        <main className="container mx-auto px-4 pt-24 pb-20">
          <h1 className="text-4xl font-light mb-6 text-gradient-primary">Logs Viewer</h1>
          <div className="glass-morphism p-8 rounded-lg text-center">
            <p className="text-white/70">You don't have permission to view logs.</p>
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
            Refresh
          </Button>
        </div>
        
        <LogsFilter
          currentFilters={filters}
          onFilterChange={updateFilters}
        />
        
        <LogsTabs 
          defaultValue="system"
          tabValues={[
            { value: 'system', label: 'System Logs', count: logs.length },
            { value: 'user', label: 'User Logs', count: 0 },
          ]}
        >
          <LogsTable logs={logs} isLoading={isLoading} />
        </LogsTabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default LogsViewer;
