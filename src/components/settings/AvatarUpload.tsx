
import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const AvatarUpload: React.FC = () => {
  const { profile, uploadAvatar } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione uma imagem.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Create a preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the file
    try {
      setUploading(true);
      await uploadAvatar(file);
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error);
      toast({
        title: "Erro ao fazer upload",
        description: "Não foi possível atualizar a foto de perfil.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getInitials = (): string => {
    if (!profile) return '?';
    
    if (profile.display_name) {
      return profile.display_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    
    return profile.username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24 border-2 border-white/20">
        <AvatarImage 
          src={preview || profile?.avatar || ''} 
          alt={profile?.display_name || profile?.username || 'User'} 
        />
        <AvatarFallback className="bg-purple-800 text-white text-xl">
          {getInitials()}
        </AvatarFallback>
      </Avatar>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      <Button 
        onClick={handleUploadClick} 
        disabled={uploading}
        variant="outline" 
        className="text-white bg-black/20 border-white/10 hover:bg-black/40"
      >
        {uploading ? (
          'Fazendo upload...'
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Alterar Foto
          </>
        )}
      </Button>
    </div>
  );
};

export default AvatarUpload;
