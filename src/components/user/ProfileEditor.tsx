
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { GlassCard } from '@/components/ui/glass-card';
import { User, Settings, CreditCard, Lock, Image } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ProfileEditor: React.FC = () => {
  const { profile, updateProfile, uploadAvatar } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || '',
    username: profile?.username || '',
    bio: profile?.bio || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const { error } = await updateProfile({
        display_name: formData.display_name,
        username: formData.username,
        bio: formData.bio,
      });

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso",
        variant: "default",
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível atualizar suas informações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const { error } = await uploadAvatar(file);
      
      if (error) throw error;
      
      toast({
        title: "Avatar atualizado",
        description: "Seu avatar foi atualizado com sucesso",
        variant: "default",
      });
    } catch (error) {
      console.error('Erro ao fazer upload de avatar:', error);
      toast({
        title: "Erro ao atualizar avatar",
        description: "Não foi possível fazer upload da imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!profile) return null;

  return (
    <GlassCard className="max-w-3xl mx-auto">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="general">
            <User className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Geral</span>
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Settings className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Aparência</span>
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Pagamentos</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar || undefined} alt={profile.display_name} />
                  <AvatarFallback className="bg-purple-900/50 text-lg">
                    {profile.display_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex flex-col items-center">
                  <Label 
                    htmlFor="avatar-upload" 
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md cursor-pointer text-sm flex items-center"
                  >
                    <Image className="h-4 w-4 mr-2" />
                    {isUploading ? 'Enviando...' : 'Alterar avatar'}
                  </Label>
                  <Input 
                    id="avatar-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleAvatarUpload}
                    disabled={isUploading}
                  />
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="display_name">Nome de exibição</Label>
                  <Input
                    id="display_name"
                    name="display_name"
                    value={formData.display_name}
                    onChange={handleChange}
                    className="bg-black/20 border-white/10"
                  />
                </div>
                
                <div>
                  <Label htmlFor="username">Nome de usuário</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="bg-black/20 border-white/10"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleChange}
                    className="bg-black/20 border-white/10 min-h-[100px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="bg-black/20 border-white/10 text-white/60"
                  />
                </div>
                
                <div>
                  <Label>Tipo de perfil</Label>
                  <div className="py-2 px-3 rounded bg-black/20 border border-white/10 text-white/80">
                    {profile.profile_type.charAt(0).toUpperCase() + profile.profile_type.slice(1)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={isUpdating} 
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isUpdating ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="appearance">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Tema</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-white/10 rounded-lg p-4 cursor-pointer bg-black/20 flex items-center space-x-2">
                <div className="h-4 w-4 bg-white rounded-full"></div>
                <span>Claro</span>
              </div>
              <div className="border border-purple-500/30 rounded-lg p-4 cursor-pointer bg-black/40 flex items-center space-x-2">
                <div className="h-4 w-4 bg-purple-500 rounded-full"></div>
                <span>Escuro</span>
              </div>
            </div>
            
            <h3 className="text-lg font-medium mt-6">Idioma</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-purple-500/30 rounded-lg p-4 cursor-pointer bg-black/40 flex items-center space-x-2">
                <span className="text-lg">🇧🇷</span>
                <span>Português</span>
              </div>
              <div className="border border-white/10 rounded-lg p-4 cursor-pointer bg-black/20 flex items-center space-x-2">
                <span className="text-lg">🇺🇸</span>
                <span>English</span>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="billing">
          <div className="text-center py-12">
            <p className="text-white/60">Gerenciamento de pagamentos em desenvolvimento</p>
            <p className="text-white/40 text-sm mt-2">Em breve você poderá gerenciar seus métodos de pagamento</p>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Alterar senha</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current_password">Senha atual</Label>
                  <Input
                    id="current_password"
                    type="password"
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="new_password">Nova senha</Label>
                  <Input
                    id="new_password"
                    type="password"
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm_password">Confirmar nova senha</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    className="bg-black/20 border-white/10"
                  />
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Atualizar senha
                </Button>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-6 mt-6">
              <h3 className="text-lg font-medium mb-4">Autenticação em duas etapas</h3>
              <p className="text-white/60 mb-4">
                Adicione uma camada extra de segurança à sua conta ativando a autenticação em duas etapas.
              </p>
              <Button variant="outline">
                Configurar autenticação em duas etapas
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </GlassCard>
  );
};

export default ProfileEditor;
