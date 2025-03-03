import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { User, Settings, CreditCard, KeyRound, Bell, FileText } from 'lucide-react';

const profileFormSchema = z.object({
  display_name: z.string().min(2, {
    message: 'Nome de exibição deve ter pelo menos 2 caracteres.',
  }),
  username: z.string().min(3, {
    message: 'Nome de usuário deve ter pelo menos 3 caracteres.',
  }),
  bio: z.string().max(160, {
    message: 'Bio deve ter no máximo 160 caracteres.',
  }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfilePage: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
  });

  useEffect(() => {
    if (profile) {
      setValue('display_name', profile.display_name);
      setValue('username', profile.username);
      setValue('bio', profile.bio || '');
    }
  }, [profile, setValue]);

  if (!user || !profile) {
    return <Navigate to="/auth/login" replace />;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const updateProfile = async (data: any) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: data.display_name,
          username: data.username,
          bio: data.bio,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      await refreshProfile();
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      toast.error(`Erro ao atualizar perfil: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 text-white">
      <Card className="bg-black/90 border border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl">
            <User className="mr-2 h-5 w-5 inline-block align-middle" />
            Meu Perfil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile" onClick={() => setActiveTab('profile')}>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </TabsTrigger>
              <TabsTrigger value="settings" onClick={() => setActiveTab('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </TabsTrigger>
              <TabsTrigger value="billing" onClick={() => setActiveTab('billing')}>
                <CreditCard className="mr-2 h-4 w-4" />
                Cobrança
              </TabsTrigger>
              <TabsTrigger value="security" onClick={() => setActiveTab('security')}>
                <KeyRound className="mr-2 h-4 w-4" />
                Segurança
              </TabsTrigger>
              <TabsTrigger value="notifications" onClick={() => setActiveTab('notifications')}>
                <Bell className="mr-2 h-4 w-4" />
                Notificações
              </TabsTrigger>
              <TabsTrigger value="legal" onClick={() => setActiveTab('legal')}>
                <FileText className="mr-2 h-4 w-4" />
                Legal
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <div className="grid gap-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 border border-white/20">
                    {profile.avatar ? (
                      <AvatarImage src={profile.avatar} alt={profile.display_name} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                        {getInitials(profile.display_name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-semibold">{profile.display_name}</h2>
                    <p className="text-sm text-white/70">@{profile.username}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(updateProfile)} className="grid gap-4">
                  <div>
                    <Label htmlFor="display_name">Nome de Exibição</Label>
                    <Input
                      id="display_name"
                      type="text"
                      placeholder="Seu nome de exibição"
                      {...register('display_name')}
                    />
                    {errors.display_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.display_name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="username">Nome de Usuário</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Seu nome de usuário"
                      {...register('username')}
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Uma pequena descrição sobre você"
                      {...register('bio')}
                    />
                    {errors.bio && (
                      <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
                    )}
                  </div>
                  <Button disabled={isLoading} type="submit">
                    {isLoading ? 'Atualizando...' : 'Atualizar Perfil'}
                  </Button>
                </form>
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <div>
                <h3 className="text-lg font-semibold mb-2">Configurações da Conta</h3>
                <p className="text-white/70">Gerencie as configurações da sua conta.</p>
                {/* Adicione aqui os componentes de configurações */}
              </div>
            </TabsContent>
            <TabsContent value="billing">
              <div>
                <h3 className="text-lg font-semibold mb-2">Informações de Cobrança</h3>
                <p className="text-white/70">Visualize e gerencie suas informações de cobrança.</p>
                {/* Adicione aqui os componentes de cobrança */}
              </div>
            </TabsContent>
            <TabsContent value="security">
              <div>
                <h3 className="text-lg font-semibold mb-2">Segurança</h3>
                <p className="text-white/70">Altere sua senha e gerencie as opções de segurança.</p>
                {/* Adicione aqui os componentes de segurança */}
              </div>
            </TabsContent>
            <TabsContent value="notifications">
              <div>
                <h3 className="text-lg font-semibold mb-2">Notificações</h3>
                <p className="text-white/70">Gerencie suas preferências de notificação.</p>
                {/* Adicione aqui os componentes de notificação */}
              </div>
            </TabsContent>
            <TabsContent value="legal">
              <div>
                <h3 className="text-lg font-semibold mb-2">Informações Legais</h3>
                <p className="text-white/70">Visualize nossos termos de serviço e política de privacidade.</p>
                {/* Adicione aqui os componentes de informações legais */}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
