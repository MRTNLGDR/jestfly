
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GlassCard } from '@/components/ui/glass-card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import Loading from '@/components/ui/loading';
import { Navigate } from 'react-router-dom';
import { User, Shield, Bell, Lock, Palette, Globe } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { profile, loading, updateProfile } = useAuth();
  const { toast } = useToast();
  const { logProfileUpdate } = useActivityLogger();
  
  const [updating, setUpdating] = useState(false);
  
  // Estados para os diferentes formulários
  const [profileData, setProfileData] = useState({
    display_name: '',
    username: '',
    bio: ''
  });
  
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'pt',
    currency: 'BRL',
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  });
  
  // Carregar dados do perfil quando disponíveis
  React.useEffect(() => {
    if (profile) {
      setProfileData({
        display_name: profile.display_name || '',
        username: profile.username || '',
        bio: profile.bio || ''
      });
      
      if (profile.preferences) {
        setPreferences({
          ...preferences,
          ...profile.preferences
        });
      }
    }
  }, [profile]);
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;
    
    setUpdating(true);
    
    try {
      const { data, error } = await updateProfile({
        display_name: profileData.display_name,
        username: profileData.username,
        bio: profileData.bio
      });
      
      if (error) {
        throw error;
      }
      
      await logProfileUpdate(true, ['display_name', 'username', 'bio']);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive"
      });
      
      await logProfileUpdate(false);
    } finally {
      setUpdating(false);
    }
  };
  
  const handlePreferencesUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;
    
    setUpdating(true);
    
    try {
      const { data, error } = await updateProfile({
        preferences: preferences
      });
      
      if (error) {
        throw error;
      }
      
      await logProfileUpdate(true, ['preferences']);
      
      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as preferências.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center">
        <Loading size="lg" text="Carregando configurações..." />
      </div>
    );
  }
  
  // Redirecionar se não estiver autenticado
  if (!profile) {
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">Configurações</h1>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-black/20 border border-white/10 p-1">
            <TabsTrigger value="profile" className="data-[state=active]:bg-purple-600">
              <User className="h-4 w-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-purple-600">
              <Palette className="h-4 w-4 mr-2" />
              Preferências
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-600">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-purple-600">
              <Lock className="h-4 w-4 mr-2" />
              Segurança
            </TabsTrigger>
            {profile.profile_type === 'admin' && (
              <TabsTrigger value="admin" className="data-[state=active]:bg-purple-600">
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="profile">
            <GlassCard>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-white">Informações de Perfil</h2>
                
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="display_name" className="text-white">Nome de Exibição</Label>
                      <Input
                        id="display_name"
                        value={profileData.display_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, display_name: e.target.value }))}
                        className="bg-black/20 border-white/10 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-white">Nome de Usuário</Label>
                      <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                        className="bg-black/20 border-white/10 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-white">Biografia</Label>
                    <textarea
                      id="bio"
                      value={profileData.bio || ''}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full rounded bg-black/20 border border-white/10 p-2 text-white"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" disabled={updating} className="bg-purple-600 hover:bg-purple-700">
                      {updating ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                  </div>
                </form>
              </div>
            </GlassCard>
          </TabsContent>
          
          <TabsContent value="preferences">
            <GlassCard>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-white">Preferências do Usuário</h2>
                
                <form onSubmit={handlePreferencesUpdate} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Aparência</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="theme" className="text-white">Tema</Label>
                        <select
                          id="theme"
                          value={preferences.theme}
                          onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
                          className="w-full rounded bg-black/20 border border-white/10 p-2 text-white"
                        >
                          <option value="dark">Escuro</option>
                          <option value="light">Claro</option>
                          <option value="system">Sistema</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="language" className="text-white">Idioma</Label>
                        <select
                          id="language"
                          value={preferences.language}
                          onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                          className="w-full rounded bg-black/20 border border-white/10 p-2 text-white"
                        >
                          <option value="pt">Português</option>
                          <option value="en">English</option>
                          <option value="es">Español</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Regional</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currency" className="text-white">Moeda</Label>
                        <select
                          id="currency"
                          value={preferences.currency}
                          onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
                          className="w-full rounded bg-black/20 border border-white/10 p-2 text-white"
                        >
                          <option value="BRL">Real (R$)</option>
                          <option value="USD">Dólar (US$)</option>
                          <option value="EUR">Euro (€)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" disabled={updating} className="bg-purple-600 hover:bg-purple-700">
                      {updating ? 'Salvando...' : 'Salvar Preferências'}
                    </Button>
                  </div>
                </form>
              </div>
            </GlassCard>
          </TabsContent>
          
          <TabsContent value="notifications">
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
          </TabsContent>
          
          <TabsContent value="security">
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
          </TabsContent>
          
          {profile.profile_type === 'admin' && (
            <TabsContent value="admin">
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
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
