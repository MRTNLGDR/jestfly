
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/auth/useAuth';
import { supabase } from '../integrations/supabase/client';
import GlassHeader from '../components/GlassHeader';
import Footer from '../components/Footer';
import LogsFilter from '../components/logs/LogsFilter';
import LogsTable from '../components/logs/LogsTable';
import LogsTabs from '../components/logs/LogsTabs';
import { LogLevel, LogSource, LogModule, Log } from '../types/logs';
import { Button } from '../components/ui/button';
import { RefreshCw } from 'lucide-react';

// Define the database log structure
interface DbLog {
  id: string;
  created_at: string;
  level: string;
  source: string;
  type: string;
  message: string;
  user_id?: string;
  metadata?: Record<string, any>;
}

const LogsViewer: React.FC = () => {
  const { user, profile } = useAuth();
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [filters, setFilters] = useState({
    level: null as LogLevel | null,
    source: null as LogSource | null,
    search: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  const isAdmin = profile?.profile_type === 'admin';

  // Define fetchLogs outside of any hooks to avoid dependency cycles
  function fetchLogs() {
    setIsLoadingLogs(true);
    
    if (!user || !isAdmin) {
      setLogs([]);
      setIsLoadingLogs(false);
      return;
    }
    
    let query = supabase
      .from('system_logs')
      .select('*');
    
    // Apply filters
    if (filters.level) {
      query = query.eq('level', filters.level);
    }
    
    if (filters.source) {
      query = query.eq('source', filters.source);
    }
    
    if (filters.search) {
      query = query.ilike('message', `%${filters.search}%`);
    }
    
    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate.toISOString());
    }
    
    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate.toISOString());
    }
    
    // Order by most recent first
    query = query.order('created_at', { ascending: false });
    
    query.then(({ data, error }) => {
      if (error) {
        console.error('Error fetching logs:', error);
        return;
      }
      
      // Transform database logs to the Log type
      const formattedLogs: Log[] = (data as DbLog[]).map((dbLog: DbLog) => ({
        id: dbLog.id,
        timestamp: dbLog.created_at,
        level: dbLog.level as LogLevel,
        source: dbLog.source as LogSource,
        type: dbLog.type as LogModule,
        message: dbLog.message,
        userId: dbLog.user_id || '',
        metadata: dbLog.metadata || {}
      }));
      
      setLogs(formattedLogs);
      setIsLoadingLogs(false);
    }).catch(error => {
      console.error('Error in fetchLogs:', error);
      setIsLoadingLogs(false);
    });
  }

  // Initial fetch on component mount
  useEffect(() => {
    fetchLogs();
  }, [user, isAdmin]); // Only re-fetch when user or isAdmin changes

  // Separate effect for filter changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters]); // This is safe now because fetchLogs is defined outside hooks

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

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
            onClick={fetchLogs} 
            variant="outline"
            className="bg-black/30 border-white/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        <LogsFilter
          currentFilters={filters}
          onFilterChange={handleFilterChange}
        />
        
        <LogsTabs 
          defaultValue="system"
          tabValues={[
            { value: 'system', label: 'System Logs', count: logs.length },
            { value: 'user', label: 'User Logs', count: 0 },
          ]}
        >
          <LogsTable logs={logs} isLoading={isLoadingLogs} />
        </LogsTabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default LogsViewer;
