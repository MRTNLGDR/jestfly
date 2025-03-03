
import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Download, Search, RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Loading from '@/components/ui/loading';
import { Json } from '@/integrations/supabase/types';

interface LogProfile {
  username?: string;
  display_name?: string;
  profile_type?: string;
}

interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  success: boolean;
  profile?: LogProfile;
}

const LogsPage: React.FC = () => {
  const { profile } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [actionFilter, setActionFilter] = useState('');
  const [successFilter, setSuccessFilter] = useState<boolean | null>(null);

  // Verificar se o usuário é admin ou colaborador
  const isAdminOrCollaborator = profile?.profile_type === 'admin' || profile?.profile_type === 'collaborator';

  const fetchLogs = async () => {
    if (!isAdminOrCollaborator) return;
    
    setLoading(true);
    try {
      // Aqui usamos uma query "raw" para acessar a tabela que não está nos tipos gerados
      let query = supabase
        .from('user_activity_logs')
        .select(`
          *,
          profile:profiles(username, display_name, profile_type)
        `)
        .order('created_at', { ascending: false });
      
      // Aplicar filtros
      if (activeTab !== 'all') {
        query = query.eq('action', activeTab);
      }
      
      if (actionFilter) {
        query = query.eq('action', actionFilter);
      }
      
      if (dateFrom) {
        query = query.gte('created_at', dateFrom.toISOString());
      }
      
      if (dateTo) {
        // Ajustar para o final do dia
        const endOfDay = new Date(dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        query = query.lte('created_at', endOfDay.toISOString());
      }
      
      if (successFilter !== null) {
        query = query.eq('success', successFilter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Erro ao buscar logs:', error);
        return;
      }
      
      // Filtrar por termo de busca (client-side)
      let filteredData = data || [];
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filteredData = filteredData.filter(log => 
          log.action.toLowerCase().includes(lowerSearchTerm) ||
          (log.profile && log.profile.username && log.profile.username.toLowerCase().includes(lowerSearchTerm)) ||
          (log.profile && log.profile.display_name && log.profile.display_name.toLowerCase().includes(lowerSearchTerm)) ||
          (log.entity_type && log.entity_type.toLowerCase().includes(lowerSearchTerm)) ||
          (log.ip_address && log.ip_address.includes(searchTerm))
        );
      }
      
      // TypeScript não sabe o formato exato, então fazemos um cast seguro
      setLogs(filteredData as unknown as ActivityLog[]);
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminOrCollaborator) {
      fetchLogs();
    }
  }, [isAdminOrCollaborator, activeTab, dateFrom, dateTo, actionFilter, successFilter]);

  const handleSearch = () => {
    fetchLogs();
  };

  const handleReset = () => {
    setSearchTerm('');
    setDateFrom(undefined);
    setDateTo(undefined);
    setActionFilter('');
    setSuccessFilter(null);
    setActiveTab('all');
    fetchLogs();
  };

  const handleExport = () => {
    // Criar CSV dos logs filtrados
    const headers = ['ID', 'Usuário', 'Ação', 'Tipo', 'Data', 'IP', 'Sucesso', 'Detalhes'];
    const csvContent = [
      headers.join(','),
      ...logs.map(log => [
        log.id,
        log.profile?.display_name || log.user_id,
        log.action,
        log.entity_type || '',
        format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss'),
        log.ip_address || '',
        log.success ? 'Sim' : 'Não',
        JSON.stringify(log.details || {})
      ].join(','))
    ].join('\n');
    
    // Criar blob e download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `logs_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Renderizar mensagem de acesso negado se não for admin ou colaborador
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
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">Logs do Sistema</h1>
        
        <GlassCard className="p-6 mb-8">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Pesquisar logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/20 border-white/20 text-white"
                />
              </div>
              
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="border-white/20 bg-black/20 text-white w-[140px] justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, 'dd/MM/yyyy') : 'De'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-black/80 border-white/20">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="border-white/20 bg-black/20 text-white w-[140px] justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, 'dd/MM/yyyy') : 'Até'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-black/80 border-white/20">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
                <Button onClick={handleReset} variant="outline" className="border-white/20 bg-black/20 hover:bg-black/40">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
                <Button onClick={handleExport} variant="outline" className="border-white/20 bg-black/20 hover:bg-black/40">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 bg-black/30 mb-8 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-700">
              Todos
            </TabsTrigger>
            <TabsTrigger value="user.login" className="data-[state=active]:bg-blue-700">
              Logins
            </TabsTrigger>
            <TabsTrigger value="user.logout" className="data-[state=active]:bg-red-700">
              Logouts
            </TabsTrigger>
            <TabsTrigger value="profile.update" className="data-[state=active]:bg-green-700">
              Perfil
            </TabsTrigger>
            <TabsTrigger value="access.attempt" className="data-[state=active]:bg-yellow-700">
              Acessos
            </TabsTrigger>
            <TabsTrigger value="data.change" className="data-[state=active]:bg-pink-700">
              Dados
            </TabsTrigger>
          </TabsList>
          
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">Usuário</TableHead>
                      <TableHead className="text-white">Ação</TableHead>
                      <TableHead className="text-white">Tipo</TableHead>
                      <TableHead className="text-white">Data</TableHead>
                      <TableHead className="text-white">IP</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-white/5">
                        <TableCell className="text-white/90">
                          {log.profile?.display_name || 'N/A'}
                          <div className="text-xs text-white/50">{log.profile?.profile_type || 'N/A'}</div>
                        </TableCell>
                        <TableCell className="text-white/90">{log.action}</TableCell>
                        <TableCell className="text-white/90">{log.entity_type || 'N/A'}</TableCell>
                        <TableCell className="text-white/90">
                          {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss')}
                        </TableCell>
                        <TableCell className="text-white/90">{log.ip_address || 'N/A'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${log.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                            {log.success ? 'Sucesso' : 'Falha'}
                          </span>
                        </TableCell>
                        <TableCell className="text-white/90">
                          <details className="text-xs">
                            <summary className="cursor-pointer">Ver detalhes</summary>
                            <pre className="mt-2 p-2 bg-black/30 rounded text-white/70 overflow-x-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </GlassCard>
        </Tabs>
      </div>
    </div>
  );
};

export default LogsPage;
