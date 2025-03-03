
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const useSignOut = (setProfile: (profile: any) => void) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const signOut = async () => {
    try {
      console.log('Realizando logout');
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Erro ao fazer logout:', error);
        toast({
          title: "Erro ao fazer logout",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setProfile(null);
        console.log('Logout bem-sucedido, perfil removido');
        toast({
          title: "Logout realizado",
          description: "Você saiu da sua conta com sucesso.",
          variant: "default",
        });
        navigate('/');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Exceção durante logout:', error);
      toast({
        title: "Erro ao fazer logout",
        description: (error as Error).message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return {
    signOut,
    loading
  };
};
