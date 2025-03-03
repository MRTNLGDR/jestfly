
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import Loading from '@/components/ui/loading';
import { Navigate } from 'react-router-dom';
import { User, Shield, Bell, Lock, Palette } from 'lucide-react';

// Import tab components
import ProfileTab from '@/components/settings/ProfileTab';
import PreferencesTab from '@/components/settings/PreferencesTab';
import NotificationsTab from '@/components/settings/NotificationsTab';
import SecurityTab from '@/components/settings/SecurityTab';
import AdminTab from '@/components/settings/AdminTab';

const SettingsPage: React.FC = () => {
  const { profile, loading, updateProfile } = useAuth();
  const { toast } = useToast();
  const { logProfileUpdate } = useActivityLogger();
  
  const [updating, setUpdating] = useState(false);
  
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
            <ProfileTab 
              profileData={profileData} 
              setProfileData={setProfileData} 
              handleProfileUpdate={handleProfileUpdate} 
              updating={updating} 
            />
          </TabsContent>
          
          <TabsContent value="preferences">
            <PreferencesTab 
              preferences={preferences} 
              setPreferences={setPreferences} 
              handlePreferencesUpdate={handlePreferencesUpdate} 
              updating={updating} 
            />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationsTab 
              preferences={preferences} 
              setPreferences={setPreferences} 
              handlePreferencesUpdate={handlePreferencesUpdate} 
              updating={updating} 
            />
          </TabsContent>
          
          <TabsContent value="security">
            <SecurityTab profile={profile} />
          </TabsContent>
          
          {profile.profile_type === 'admin' && (
            <TabsContent value="admin">
              <AdminTab />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
