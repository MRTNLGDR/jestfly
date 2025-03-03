
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UserCog, Upload, Camera, Check } from 'lucide-react';

const ProfileForm: React.FC = () => {
  const { profile, updateProfile, isAdmin, isArtist, isCollaborator } = useAuth();
  const { uploadAvatar, uploading } = useAvatarUpload();
  
  const [formData, setFormData] = useState({
    display_name: '',
    username: '',
    bio: '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;
    
    try {
      // Validar campos
      if (!formData.display_name.trim() || !formData.username.trim()) {
        toast.error('Nome de exibição e nome de usuário são obrigatórios');
        return;
      }
      
      // Atualizar perfil
      const { error } = await updateProfile({
        display_name: formData.display_name,
        username: formData.username,
        bio: formData.bio,
      });
      
      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        toast.error('Não foi possível atualizar o perfil');
        return;
      }
      
      toast.success('Perfil atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Ocorreu um erro ao atualizar o perfil');
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    
    // Mostrar preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Fazer upload
    await uploadAvatar(file);
  };

  if (!profile) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Carregando informações do perfil...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto bg-black/30 backdrop-blur-sm border-purple-700/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-purple-400">Seu Perfil</CardTitle>
        <CardDescription className="text-white/60">
          Atualize seus dados de perfil e avatar
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
          {/* Coluna do Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-32 h-32 border-2 border-purple-500/50">
                <AvatarImage 
                  src={avatarPreview || profile.avatar || undefined} 
                  alt={profile.display_name} 
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-700 to-blue-600">
                  {profile.display_name?.substring(0, 2).toUpperCase() || "JF"}
                </AvatarFallback>
              </Avatar>
              
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors"
              >
                <Camera size={16} className="text-white" />
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarChange}
                  disabled={uploading}
                />
              </label>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-white/60">Perfil</div>
              <div className="font-medium text-purple-400">
                {profile.profile_type === 'admin' && 'Administrador'}
                {profile.profile_type === 'artist' && 'Artista'}
                {profile.profile_type === 'collaborator' && 'Colaborador'}
                {profile.profile_type === 'fan' && 'Fã'}
              </div>
            </div>
          </div>
          
          {/* Coluna do Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display_name" className="text-white">Nome de exibição</Label>
              <Input
                id="display_name"
                name="display_name"
                value={formData.display_name}
                onChange={handleInputChange}
                placeholder="Seu nome público"
                className="bg-black/20 border-purple-900/50 focus-visible:ring-purple-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">Nome de usuário</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="seu_username"
                className="bg-black/20 border-purple-900/50 focus-visible:ring-purple-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white">Biografia</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio || ''}
                onChange={handleInputChange}
                placeholder="Conte um pouco sobre você..."
                className="bg-black/20 border-purple-900/50 focus-visible:ring-purple-500 min-h-[100px]"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Check className="mr-2 h-4 w-4" />
              Salvar alterações
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
