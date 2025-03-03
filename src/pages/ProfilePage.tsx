
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileForm from '@/components/profile/ProfileForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, User, Settings, Clock, Bell, CreditCard } from 'lucide-react';
import Footer from '@/components/Footer';

const ProfilePage: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
            Sua Conta JESTFLY
          </h1>
          <p className="text-white/60 max-w-2xl text-center">
            Gerencie suas informações pessoais, preferências e configurações da conta
          </p>
        </div>

        <Tabs 
          defaultValue="profile" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="max-w-5xl mx-auto"
        >
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-black/30 backdrop-blur border border-purple-900/30">
              <TabsTrigger value="profile" className="data-[state=active]:bg-purple-800/30">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="data-[state=active]:bg-purple-800/30">
                <Settings className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Preferências</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-800/30">
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Notificações</span>
              </TabsTrigger>
              <TabsTrigger value="wallet" className="data-[state=active]:bg-purple-800/30">
                <CreditCard className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">JestCoin</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="mt-0">
            <ProfileForm />
          </TabsContent>
          
          <TabsContent value="preferences" className="mt-0">
            <Card className="w-full max-w-3xl mx-auto bg-black/30 backdrop-blur-sm border-purple-700/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-400">Preferências</CardTitle>
                <CardDescription className="text-white/60">
                  Personalize sua experiência na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40">
                  <p className="text-white/60">Em breve: Configurações de tema, idioma e mais!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-0">
            <Card className="w-full max-w-3xl mx-auto bg-black/30 backdrop-blur-sm border-purple-700/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-400">Notificações</CardTitle>
                <CardDescription className="text-white/60">
                  Gerencie como deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40">
                  <p className="text-white/60">Em breve: Centro de notificações!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="wallet" className="mt-0">
            <Card className="w-full max-w-3xl mx-auto bg-black/30 backdrop-blur-sm border-purple-700/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-400">Sua Carteira</CardTitle>
                <CardDescription className="text-white/60">
                  Gerencie seus JestCoins e ativos digitais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40">
                  <p className="text-white/60">Em breve: Sistema de JestCoin!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
