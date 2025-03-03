
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ProfileData } from '@/types/auth';

interface SecurityTabProps {
  profile: ProfileData;
}

const SecurityTab: React.FC<SecurityTabProps> = ({ profile }) => {
  return (
    <GlassCard>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Segurança da Conta</h2>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Alterar Senha</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password" className="text-white">Senha Atual</Label>
                <Input
                  id="current_password"
                  type="password"
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new_password" className="text-white">Nova Senha</Label>
                <Input
                  id="new_password"
                  type="password"
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm_password" className="text-white">Confirmar Nova Senha</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>
            </div>
            
            <Button className="bg-purple-600 hover:bg-purple-700">
              Alterar Senha
            </Button>
          </div>
          
          <div className="border-t border-white/10 pt-6 space-y-4">
            <h3 className="text-lg font-medium text-white">Verificação em Duas Etapas</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Autenticação em duas etapas</p>
                <p className="text-sm text-white/60">Adicione uma camada extra de segurança</p>
              </div>
              <Switch
                id="two_factor"
                checked={profile.two_factor_enabled || false}
              />
            </div>
            
            <Button className="bg-purple-600 hover:bg-purple-700" disabled={profile.two_factor_enabled}>
              {profile.two_factor_enabled ? 'Configurado' : 'Configurar 2FA'}
            </Button>
          </div>
          
          <div className="border-t border-white/10 pt-6 space-y-4">
            <h3 className="text-lg font-medium text-white">Sessões Ativas</h3>
            
            <div className="bg-black/30 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-medium">Navegador Chrome</p>
                  <p className="text-sm text-white/60">Windows 10 • São Paulo, Brasil</p>
                  <p className="text-xs text-white/40 mt-1">Último acesso: 2 horas atrás</p>
                </div>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                  Atual
                </span>
              </div>
            </div>
            
            <Button variant="destructive">
              Encerrar Todas as Sessões
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default SecurityTab;
