import React from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import ProfileForm from '@/components/profile/ProfileForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen pt-24 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Minha Conta</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-black/30 text-white mb-8">
            <TabsTrigger value="profile" className="data-[state=active]:bg-purple-700">Perfil</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-700">Configurações</TabsTrigger>
            <TabsTrigger value="account" className="data-[state=active]:bg-purple-700">Conta</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileForm />
          </TabsContent>
          
          <TabsContent value="settings">
            <Card className="bg-black/40 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Configurações</CardTitle>
                <CardDescription className="text-white/60">
                  Gerencie suas preferências e configurações
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-white/70">
                <div className="py-12 text-center">
                  <p>Configurações em desenvolvimento...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card className="bg-black/40 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Informações da Conta</CardTitle>
                <CardDescription className="text-white/60">
                  Detalhes da sua conta JESTFLY
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-black/30 rounded-lg">
                      <p className="text-sm text-white/60 mb-2">Email</p>
                      <p className="text-white">{profile.email}</p>
                    </div>
                    
                    <div className="p-4 bg-black/30 rounded-lg">
                      <p className="text-sm text-white/60 mb-2">Tipo de Conta</p>
                      <p className="text-white capitalize">{profile.profile_type}</p>
                    </div>
                    
                    <div className="p-4 bg-black/30 rounded-lg">
                      <p className="text-sm text-white/60 mb-2">Data de Registro</p>
                      <p className="text-white">
                        {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-black/30 rounded-lg">
                      <p className="text-sm text-white/60 mb-2">Status da Conta</p>
                      <div className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        <p className="text-white">Ativa</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
