
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface NotificationsTabProps {
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  setPreferences: React.Dispatch<React.SetStateAction<{
    theme: string;
    language: string;
    currency: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  }>>;
  handlePreferencesUpdate: (e: React.FormEvent) => Promise<void>;
  updating: boolean;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({ 
  preferences, 
  setPreferences, 
  handlePreferencesUpdate, 
  updating 
}) => {
  return (
    <GlassCard>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Configurações de Notificações</h2>
        
        <form className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Canais de Notificação</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email_notif" className="text-white">Notificações por Email</Label>
                  <p className="text-sm text-white/60">Receba atualizações no seu email</p>
                </div>
                <Switch
                  id="email_notif"
                  checked={preferences.notifications.email}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        email: checked
                      }
                    }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push_notif" className="text-white">Notificações Push</Label>
                  <p className="text-sm text-white/60">Notificações no navegador</p>
                </div>
                <Switch
                  id="push_notif"
                  checked={preferences.notifications.push}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        push: checked
                      }
                    }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms_notif" className="text-white">Notificações SMS</Label>
                  <p className="text-sm text-white/60">Receba mensagens no seu celular</p>
                </div>
                <Switch
                  id="sms_notif"
                  checked={preferences.notifications.sms}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        sms: checked
                      }
                    }))
                  }
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button type="button" onClick={handlePreferencesUpdate} disabled={updating} className="bg-purple-600 hover:bg-purple-700">
              {updating ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </form>
      </div>
    </GlassCard>
  );
};

export default NotificationsTab;
