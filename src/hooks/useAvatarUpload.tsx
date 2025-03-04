
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UseAvatarUploadResult {
  uploading: boolean;
  uploadAvatar: (file: File) => Promise<string | null>;
}

export const useAvatarUpload = (): UseAvatarUploadResult => {
  const [uploading, setUploading] = useState(false);
  const { uploadAvatar } = useAuth();

  const handleUpload = async (file: File): Promise<string | null> => {
    if (!file) return null;
    
    try {
      setUploading(true);
      const result = await uploadAvatar(file);
      return result.avatarUrl;
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadAvatar: handleUpload
  };
};
