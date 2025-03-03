
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield, Globe, Users, Activity } from 'lucide-react';

const AdminTab: React.FC = () => {
  return (
    <GlassCard>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Configurações de Administrador</h2>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Permissões Avançadas</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">Acesso ao sistema de logs</p>
                  <p className="text-sm text-white/60">Visualizar logs de atividade do sistema</p>
                </div>
                <Switch id="logs_access" checked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">Gerenciamento de usuários</p>
                  <p className="text-sm text-white/60">Criar, editar e excluir usuários</p>
                </div>
                <Switch id="user_management" checked={true} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white">Configurações do sistema</p>
                  <p className="text-sm text-white/60">Alterar configurações globais</p>
                </div>
                <Switch id="system_settings" checked={true} />
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-6 space-y-4">
            <h3 className="text-lg font-medium text-white">Links Rápidos</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Shield className="h-4 w-4 mr-2" />
                Painel de Administração
              </Button>
              
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Globe className="h-4 w-4 mr-2" />
                Configurações do Site
              </Button>
              
              <Button className="bg-yellow-600 hover:bg-yellow-700">
                <Users className="h-4 w-4 mr-2" />
                Gerenciar Usuários
              </Button>
              
              <Button className="bg-red-600 hover:bg-red-700">
                <Activity className="h-4 w-4 mr-2" />
                Logs do Sistema
              </Button>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default AdminTab;
