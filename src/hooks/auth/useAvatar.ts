
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export const useAvatar = (user: User | null, updateProfile: (data: any) => Promise<any>) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadAvatar = async (file: File) => {
    if (!user) {
      console.error('Tentativa de upload de avatar sem usuário autenticado');
      return { url: '', error: new Error('Usuário não autenticado') };
    }

    try {
      setUploading(true);
      console.log('Iniciando upload de avatar para usuário:', user.id);
      
      // Verificar se o bucket existe
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      if (bucketsError) {
        console.error('Erro ao listar buckets:', bucketsError);
        throw bucketsError;
      }
      
      const avatarBucketExists = buckets.some(bucket => bucket.name === 'avatars');
      if (!avatarBucketExists) {
        console.error('Bucket "avatars" não encontrado');
        throw new Error('O bucket de avatares não está configurado no projeto Supabase');
      }
      
      // Criar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      console.log('Fazendo upload do arquivo:', filePath);

      // Upload do arquivo para o bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw uploadError;
      }

      // Obter URL pública do arquivo
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Atualizar perfil com a nova URL do avatar
      const avatarUrl = data.publicUrl;
      console.log('URL do avatar obtida:', avatarUrl);
      
      await updateProfile({ avatar: avatarUrl });
      console.log('Perfil atualizado com novo avatar');

      toast({
        title: "Avatar atualizado",
        description: "Sua foto de perfil foi atualizada com sucesso.",
        variant: "default",
      });

      setUploading(false);
      return { url: avatarUrl, error: null };
    } catch (error) {
      console.error('Exceção durante upload de avatar:', error);
      toast({
        title: "Erro ao fazer upload",
        description: (error as Error).message,
        variant: "destructive",
      });
      setUploading(false);
      return { url: '', error: error as Error };
    }
  };

  return {
    uploadAvatar,
    uploading
  };
};
