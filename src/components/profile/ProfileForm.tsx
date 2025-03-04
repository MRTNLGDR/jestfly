
import React, { useState } from 'react';
import { useAuth, ProfileData } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ProfileForm: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const { uploading, uploadAvatar } = useAvatarUpload();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<ProfileData>>({
    display_name: profile?.display_name || '',
    username: profile?.username || '',
    bio: profile?.bio || '',
    wallet_address: profile?.wallet_address || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadAvatar(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile(formData);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!profile) return null;

  return (
    <Card className="w-full bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl text-white">Meu Perfil</CardTitle>
        <CardDescription className="text-white/60">
          Atualize suas informações de perfil
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="w-24 h-24 mb-4 border-2 border-purple-500">
              <AvatarImage src={profile.avatar || undefined} alt={profile.display_name} />
              <AvatarFallback className="bg-purple-900 text-white text-xl">
                {profile.display_name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                className="bg-black/50 text-white border-white/20 hover:bg-white/10"
                disabled={uploading}
                onClick={() => document.getElementById('avatar-upload')?.click()}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Alterar Avatar'
                )}
              </Button>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="display_name" className="text-white">Nome de Exibição</Label>
              <Input
                id="display_name"
                name="display_name"
                value={formData.display_name}
                onChange={handleChange}
                className="bg-black/30 border-white/20 text-white"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-white">Nome de Usuário</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="bg-black/30 border-white/20 text-white"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="profile_type" className="text-white">Tipo de Perfil</Label>
              <Select
                disabled
                value={profile.profile_type}
                onValueChange={(value) => handleSelectChange(value, 'profile_type')}
              >
                <SelectTrigger className="bg-black/30 border-white/20 text-white">
                  <SelectValue placeholder="Selecione um tipo" />
                </SelectTrigger>
                <SelectContent className="bg-black/80 border-white/20 text-white">
                  <SelectItem value="fan">Fã</SelectItem>
                  <SelectItem value="artist">Artista</SelectItem>
                  <SelectItem value="collaborator">Colaborador</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-white/60 mt-1">O tipo de perfil não pode ser alterado depois do registro</p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="bio" className="text-white">Biografia</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                className="bg-black/30 border-white/20 text-white resize-none min-h-[100px]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="wallet_address" className="text-white">Carteira (Wallet)</Label>
              <Input
                id="wallet_address"
                name="wallet_address"
                value={formData.wallet_address || ''}
                onChange={handleChange}
                className="bg-black/30 border-white/20 text-white"
                placeholder="Endereço da sua carteira (opcional)"
              />
            </div>
          </div>
        
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
