
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { Download, RefreshCw } from 'lucide-react';
import GlassHeader from '@/components/GlassHeader';
import Footer from '@/components/Footer';
import LogsFilter from '@/components/logs/LogsFilter';
import LogsTable from '@/components/logs/LogsTable';
import { useAuth } from '@/hooks/auth/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { LogLevel, LogSource, Log } from '@/types/logs';

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

    // Check profile type instead of user.profile_type
    if (profile?.profile_type !== 'admin') {
      navigate('/');
      toast({
        title: "Access Denied",
        description: "You don't have permission to view this page",
        variant: "destructive"
      });
      return;
    }

    fetchLogs();
  }, [user, profile, navigate, activeTab, filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      let query = supabase.from('system_logs').select('*');

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
      if (activeTab === 'system') {
        query = query.eq('type', 'SYSTEM');
      } else if (activeTab === 'user') {
        query = query.eq('type', 'USER');
      } else if (activeTab === 'security') {
        query = query.eq('type', 'SECURITY');
      }

      // Order by timestamp
      query = query.order('timestamp', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Type cast data to Log[]
      setLogs(data as Log[] || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast({
        title: "Error",
        description: "Failed to load logs",
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
    <div className="min-h-screen bg-black text-white flex flex-col">
      <GlassHeader />
      
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">System Logs</h1>
              <p className="text-white/60 mt-1">View and analyze application logs</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="border-white/10 text-white hover:bg-white/10"
                onClick={fetchLogs}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="border-white/10 text-white hover:bg-white/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
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
                  <TabsTrigger value="system">System</TabsTrigger>
                  <TabsTrigger value="user">User</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-4">
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
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
      </main>
      
      <Footer />
    </div>
  );
};

export default LogsViewer;
