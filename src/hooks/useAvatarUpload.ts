
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export const useAvatarUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { user, profile, refreshProfile } = useAuth();

  const uploadAvatar = async (file: File) => {
    if (!user) {
      toast.error('Você precisa estar logado para fazer upload de avatar');
      return null;
    }

    try {
      setUploading(true);

      // Verificar se é um arquivo de imagem válido
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione um arquivo de imagem válido');
        return null;
      }

      // Limitar tamanho a 2MB
      if (file.size > 2 * 1024 * 1024) {
        toast.error('A imagem deve ter menos de 2MB');
        return null;
      }

      // Criar um nome de arquivo único baseado no ID do usuário
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload para o bucket de armazenamento
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        toast.error('Erro ao fazer upload do avatar');
        return null;
      }

      // Obter a URL pública do arquivo
      const { data } = supabase.storage.from('profiles').getPublicUrl(filePath);
      
      // Atualizar o perfil do usuário com a nova URL do avatar
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar: data.publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error('Erro ao atualizar perfil:', updateError);
        toast.error('Erro ao atualizar avatar no perfil');
        return null;
      }

      // Recarregar as informações do perfil
      await refreshProfile();
      toast.success('Avatar atualizado com sucesso');
      return data.publicUrl;
    } catch (error) {
      console.error('Erro no processo de upload:', error);
      toast.error('Ocorreu um erro inesperado');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadAvatar,
    uploading
  };
};
