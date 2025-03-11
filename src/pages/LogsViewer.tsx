
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Refresh, Filter } from 'lucide-react';
import LogsFilter from '@/components/logs/LogsFilter';
import LogsTable from '@/components/logs/LogsTable';
import { useAuth } from '@/hooks/auth/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { LogLevel, LogSource, LogModule, Log } from '@/types/logs';
import { supabase } from '@/integrations/supabase/client';

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

const LogsViewer = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    search: '',
    level: null as LogLevel | null,
    source: null as LogSource | null,
    startDate: null as Date | null,
    endDate: null as Date | null
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (profile?.profile_type !== 'admin') {
      navigate('/');
      toast({
        title: "Access Denied",
        description: "You don't have permission to view this page.",
        variant: "destructive"
      });
      return;
    }

    fetchLogs();
  }, [user, profile, navigate, activeTab, filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('system_logs')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply filters
      if (filters.search) {
        query = query.ilike('message', `%${filters.search}%`);
      }
      
      if (filters.level) {
        query = query.eq('level', filters.level);
      }
      
      if (filters.source) {
        query = query.eq('source', filters.source);
      }

      // Apply tab filtering
      if (activeTab === 'errors') {
        query = query.eq('level', 'error');
      } else if (activeTab === 'auth') {
        query = query.eq('type', 'auth');
      } else if (activeTab === 'system') {
        query = query.eq('type', 'system');
      }

      // Apply date filters
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate.toISOString());
      }
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate.toISOString());
      }

      const { data, error } = await query.limit(100);
      
      if (error) {
        throw error;
      }

      // Map DB logs to the Log type
      const mappedLogs: Log[] = (data || []).map((dbLog: DbLog) => ({
        id: dbLog.id,
        timestamp: dbLog.created_at,
        level: dbLog.level as LogLevel,
        source: dbLog.source as LogSource,
        type: dbLog.type as LogModule,
        message: dbLog.message,
        userId: dbLog.user_id,
        metadata: dbLog.metadata
      }));

      setLogs(mappedLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch logs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Update this function to accept the right parameter type
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      level: null,
      source: null,
      startDate: null,
      endDate: null
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-light text-gradient-primary">System Logs</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetFilters}
            className="border-white/10 hover:border-white/30 text-white/70 hover:text-white"
          >
            <Filter className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchLogs}
            className="border-white/10 hover:border-white/30 text-white/70 hover:text-white"
          >
            <Refresh className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      <Card className="bg-black/40 backdrop-blur-md border-white/10">
        <CardContent className="p-6">
          <LogsFilter 
            currentFilters={filters}
            onFilterChange={handleFilterChange}
          />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="bg-black/50 border border-white/10">
              <TabsTrigger value="all">All Logs</TabsTrigger>
              <TabsTrigger value="errors">Errors</TabsTrigger>
              <TabsTrigger value="auth">Auth</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : (
                <LogsTable logs={logs} isLoading={loading} />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsViewer;
