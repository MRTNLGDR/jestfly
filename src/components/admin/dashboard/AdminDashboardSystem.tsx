
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Loading from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Database, Server, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminDashboardSystem: React.FC = () => {
  const { toast } = useToast();

  // Fetch system metrics
  const { data: metrics, isLoading, refetch } = useQuery({
    queryKey: ['system-metrics'],
    queryFn: async () => {
      // Simulando busca de métricas do sistema
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Função para limpar cache (simulada)
  const handleClearCache = async () => {
    try {
      // Simular uma chamada de API para limpar cache
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Cache limpo com sucesso",
        description: "O cache do sistema foi limpo com sucesso.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Erro ao limpar cache",
        description: "Ocorreu um erro ao tentar limpar o cache do sistema.",
        variant: "destructive"
      });
    }
  };

  // Função para fazer backup (simulada)
  const handleBackup = async () => {
    try {
      // Simular uma chamada de API para fazer backup
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Backup iniciado",
        description: "O backup do sistema foi iniciado e você será notificado quando concluir.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Erro ao iniciar backup",
        description: "Ocorreu um erro ao tentar iniciar o backup do sistema.",
        variant: "destructive"
      });
    }
  };

  // Função para reiniciar sistema (simulada)
  const handleRestart = async () => {
    try {
      // Simular uma chamada de API para reiniciar
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Sistema reiniciado",
        description: "O sistema foi reiniciado com sucesso.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Erro ao reiniciar sistema",
        description: "Ocorreu um erro ao tentar reiniciar o sistema.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">Gerenciamento do Sistema</h2>
      
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loading text="Carregando informações do sistema..." />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Ações do Sistema */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Ações do Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline"
                className="bg-black/20 text-white border-white/10 p-6 h-auto flex flex-col items-center"
                onClick={handleClearCache}
              >
                <Database className="h-10 w-10 mb-2 text-blue-400" />
                <span className="text-lg">Limpar Cache</span>
              </Button>
              
              <Button 
                variant="outline"
                className="bg-black/20 text-white border-white/10 p-6 h-auto flex flex-col items-center"
                onClick={handleBackup}
              >
                <Server className="h-10 w-10 mb-2 text-green-400" />
                <span className="text-lg">Fazer Backup</span>
              </Button>
              
              <Button 
                variant="outline"
                className="bg-black/20 text-white border-white/10 p-6 h-auto flex flex-col items-center"
                onClick={handleRestart}
              >
                <Settings className="h-10 w-10 mb-2 text-purple-400" />
                <span className="text-lg">Reiniciar Sistema</span>
              </Button>
            </div>
          </div>
          
          {/* Status do Sistema */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Status do Sistema</h3>
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Monitoramento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-white/70">CPU</span>
                    <span className="text-white font-medium">32%</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-white/70">Memória</span>
                    <span className="text-white font-medium">45%</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-white/70">Disco</span>
                    <span className="text-white font-medium">67%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Uptime</span>
                    <span className="text-white font-medium">14 dias</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Alertas do Sistema */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Alertas Recentes</h3>
            <Card className="bg-black/40 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 text-yellow-400 mb-4">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">2 alertas pendentes</span>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 bg-black/30 rounded-md border border-yellow-500/30">
                    <div className="font-medium text-white">Uso de disco acima de 65%</div>
                    <div className="text-sm text-white/70 mt-1">Considere limpar arquivos temporários para liberar espaço.</div>
                  </div>
                  
                  <div className="p-3 bg-black/30 rounded-md border border-yellow-500/30">
                    <div className="font-medium text-white">Backup automático não executado</div>
                    <div className="text-sm text-white/70 mt-1">O último backup automático falhou. Verifique as configurações.</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardSystem;
