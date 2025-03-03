import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GlassCard } from '@/components/ui/glass-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import FormField from '@/components/auth/FormField';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfileData } from '@/types/auth';

const SettingsPage: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  // Estado para armazenar preferências
  const [preferences, setPreferences] = useState({
    theme: profile?.preferences?.theme || 'dark',
    language: profile?.preferences?.language || 'pt',
    currency: profile?.preferences?.currency || 'BRL',
    notifications: {
      email: profile?.preferences?.notifications?.email !== false,
      push: profile?.preferences?.notifications?.push !== false,
      sms: profile?.preferences?.notifications?.sms === true
    }
  });
  
  // Estado para armazenar informações de segurança
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: profile?.two_factor_enabled || false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Função para atualizar preferências
  const updatePreferences = async () => {
    setSaving(true);
    try {
      const updatedProfile: Partial<ProfileData> = {
        preferences: {
          ...profile?.preferences,
          theme: preferences.theme,
          language: preferences.language,
          currency: preferences.currency,
          notifications: preferences.notifications
        }
      };
      
      const { data, error } = await updateProfile(updatedProfile);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Preferências salvas",
        description: "Suas preferências foram atualizadas com sucesso.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar suas preferências.",
        variant: "destructive",
      });
      console.error('Erro ao atualizar preferências:', error);
    } finally {
      setSaving(false);
    }
  };
  
  // Função para atualizar configurações de segurança
  const updateSecuritySettings = async () => {
    setSaving(true);
    
    // Validação de senha
    if (securitySettings.newPassword && securitySettings.newPassword !== securitySettings.confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "A nova senha e a confirmação devem ser iguais.",
        variant: "destructive",
      });
      setSaving(false);
      return;
    }
    
    try {
      // Aqui precisaríamos implementar a lógica de troca de senha utilizando supabase.auth
      // E a lógica de ativar 2FA
      
      // Atualiza o perfil com o status de 2FA
      if (profile?.two_factor_enabled !== securitySettings.twoFactorEnabled) {
        const updatedProfile: Partial<ProfileData> = {
          preferences: {
            ...profile?.preferences,
            security: {
              ...profile?.preferences?.security,
              two_factor_enabled: securitySettings.twoFactorEnabled
            }
          }
        };
        
        const { data, error } = await updateProfile(updatedProfile);
        
        if (error) {
          throw error;
        }
      }
      
      toast({
        title: "Configurações de segurança salvas",
        description: "Suas configurações de segurança foram atualizadas com sucesso.",
        variant: "default",
      });
      
      // Limpa os campos de senha
      setSecuritySettings({
        ...securitySettings,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar suas configurações de segurança.",
        variant: "destructive",
      });
      console.error('Erro ao atualizar configurações de segurança:', error);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">Configurações</h1>
        
        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-black/30 mb-8 p-1">
            <TabsTrigger value="preferences" className="data-[state=active]:bg-purple-700">
              Preferências
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-blue-700">
              Segurança
            </TabsTrigger>
            <TabsTrigger value="account" className="data-[state=active]:bg-pink-700">
              Conta
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preferences">
            <GlassCard className="p-6">
              <h2 className="text-2xl font-semibold mb-6 text-white">Preferências do Usuário</h2>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Aparência</h3>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="theme" className="text-white">Tema</Label>
                      <Select 
                        value={preferences.theme} 
                        onValueChange={(value) => setPreferences({...preferences, theme: value})}
                      >
                        <SelectTrigger id="theme" className="bg-black/30 border-white/20 text-white">
                          <SelectValue placeholder="Selecione um tema" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/80 border-white/20 text-white">
                          <SelectItem value="dark">Escuro</SelectItem>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="system">Sistema</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="language" className="text-white">Idioma</Label>
                      <Select 
                        value={preferences.language} 
                        onValueChange={(value) => setPreferences({...preferences, language: value})}
                      >
                        <SelectTrigger id="language" className="bg-black/30 border-white/20 text-white">
                          <SelectValue placeholder="Selecione um idioma" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/80 border-white/20 text-white">
                          <SelectItem value="pt">Português</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="currency" className="text-white">Moeda</Label>
                      <Select 
                        value={preferences.currency} 
                        onValueChange={(value) => setPreferences({...preferences, currency: value})}
                      >
                        <SelectTrigger id="currency" className="bg-black/30 border-white/20 text-white">
                          <SelectValue placeholder="Selecione uma moeda" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/80 border-white/20 text-white">
                          <SelectItem value="BRL">Real (R$)</SelectItem>
                          <SelectItem value="USD">Dólar (US$)</SelectItem>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Notificações</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailNotifications" className="text-white">Notificações por Email</Label>
                      <Switch 
                        id="emailNotifications" 
                        checked={preferences.notifications.email}
                        onCheckedChange={(checked) => setPreferences({
                          ...preferences, 
                          notifications: {...preferences.notifications, email: checked}
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pushNotifications" className="text-white">Notificações Push</Label>
                      <Switch 
                        id="pushNotifications" 
                        checked={preferences.notifications.push}
                        onCheckedChange={(checked) => setPreferences({
                          ...preferences, 
                          notifications: {...preferences.notifications, push: checked}
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="smsNotifications" className="text-white">Notificações por SMS</Label>
                      <Switch 
                        id="smsNotifications" 
                        checked={preferences.notifications.sms}
                        onCheckedChange={(checked) => setPreferences({
                          ...preferences, 
                          notifications: {...preferences.notifications, sms: checked}
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={updatePreferences} 
                    disabled={saving}
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    {saving ? 'Salvando...' : 'Salvar Preferências'}
                  </Button>
                </div>
              </div>
            </GlassCard>
          </TabsContent>
          
          <TabsContent value="security">
            <GlassCard className="p-6">
              <h2 className="text-2xl font-semibold mb-6 text-white">Segurança</h2>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Autenticação de Dois Fatores</h3>
                  
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Autenticação de Dois Fatores (2FA)</p>
                      <p className="text-white/70 text-sm">Adicione uma camada extra de segurança à sua conta</p>
                    </div>
                    <Switch 
                      id="twoFactor" 
                      checked={securitySettings.twoFactorEnabled}
                      onCheckedChange={(checked) => setSecuritySettings({
                        ...securitySettings, 
                        twoFactorEnabled: checked
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Alterar Senha</h3>
                  
                  <div className="space-y-4 p-4 bg-black/20 rounded-lg">
                    <FormField
                      id="currentPassword"
                      label="Senha Atual"
                      type="password"
                      value={securitySettings.currentPassword}
                      onChange={(e) => setSecuritySettings({
                        ...securitySettings,
                        currentPassword: e.target.value
                      })}
                    />
                    
                    <FormField
                      id="newPassword"
                      label="Nova Senha"
                      type="password"
                      value={securitySettings.newPassword}
                      onChange={(e) => setSecuritySettings({
                        ...securitySettings,
                        newPassword: e.target.value
                      })}
                      minLength={6}
                    />
                    
                    <FormField
                      id="confirmPassword"
                      label="Confirmar Nova Senha"
                      type="password"
                      value={securitySettings.confirmPassword}
                      onChange={(e) => setSecuritySettings({
                        ...securitySettings,
                        confirmPassword: e.target.value
                      })}
                      minLength={6}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={updateSecuritySettings} 
                    disabled={saving}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {saving ? 'Salvando...' : 'Salvar Configurações de Segurança'}
                  </Button>
                </div>
              </div>
            </GlassCard>
          </TabsContent>
          
          <TabsContent value="account">
            <GlassCard className="p-6">
              <h2 className="text-2xl font-semibold mb-6 text-white">Gerenciamento de Conta</h2>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Informações da Conta</h3>
                  
                  <div className="p-4 bg-black/20 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70">Email</span>
                      <span className="text-white">{profile?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Nome de Usuário</span>
                      <span className="text-white">{profile?.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Tipo de Perfil</span>
                      <span className="text-white">{profile?.profile_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Membro desde</span>
                      <span className="text-white">
                        {profile?.created_at 
                          ? new Date(profile.created_at).toLocaleDateString() 
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Privacidade e Dados</h3>
                  
                  <div className="p-4 bg-black/20 rounded-lg space-y-4">
                    <Button 
                      variant="outline" 
                      className="w-full border-white/20 hover:bg-red-900/30 hover:text-white"
                    >
                      Baixar Meus Dados
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-white/20 hover:bg-red-900/30 hover:text-white"
                    >
                      Excluir Minha Conta
                    </Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
