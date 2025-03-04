
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Loading from '@/components/ui/loading';
import { ActivityLog, formatLogDate, getActionColor, getLogEntityDescription } from '@/types/logs';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, Clock, User, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AdminDashboardActivity: React.FC = () => {
  const { data: recentLogs, isLoading, refetch } = useQuery({
    queryKey: ['admin-recent-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_activity_logs')
        .select(`
          *,
          profile:profiles(username, display_name, profile_type)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      // Transform data to match ActivityLog interface
      const transformedData = data?.map(log => ({
        ...log,
        timestamp: log.created_at, // Map created_at to timestamp for compatibility
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Atividade Recente</h2>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            className="text-white/80 hover:text-white"
          >
            <Clock className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          
          <Link to="/system/logs">
            <Button 
              variant="outline" 
              size="sm"
              className="text-white/80 hover:text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver todos
            </Button>
          </Link>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loading text="Carregando atividades..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {recentLogs?.length === 0 ? (
            <Card className="bg-black/20 border-white/10">
              <CardContent className="p-8 text-center">
                <User className="h-12 w-12 mx-auto text-white/30 mb-4" />
                <p className="text-white/70">Nenhuma atividade recente registrada.</p>
              </CardContent>
            </Card>
          ) : (
            recentLogs?.map(log => (
              <Card key={log.id} className="bg-black/20 border-white/10">
                <CardContent className="p-4">
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
                    <div className="text-xs text-white/50">
                      {formatLogDate(log.timestamp || log.created_at || '')}
                    </div>
                  </div>
                  {log.ip_address && (
                    <div className="text-xs text-white/30 mt-2">IP: {log.ip_address}</div>
                  )}
                  {log.details && Object.keys(log.details).length > 0 && (
                    <div className="mt-2 p-2 bg-black/30 rounded text-xs text-white/60 max-h-24 overflow-y-auto">
                      <div className="font-mono overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardActivity;
