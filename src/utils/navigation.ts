
import { toast } from '@/hooks/use-toast';

interface NavigationConfig {
  requireAuth?: boolean;
  message?: string;
  redirectUrl?: string;
  variant?: 'default' | 'destructive';
}

/**
 * Função utilitária para navegar com feedback ao usuário
 * 
 * @param navigate - Função navigate do react-router-dom
 * @param isAuthenticated - Estado de autenticação do usuário
 * @param targetUrl - URL de destino
 * @param config - Configurações adicionais
 */
export const safeNavigate = (
  navigate: (url: string) => void,
  isAuthenticated: boolean,
  targetUrl: string,
  config: NavigationConfig = {}
) => {
  const { 
    requireAuth = false, 
    message, 
    redirectUrl = '/auth', 
    variant = 'default' 
  } = config;

  if (requireAuth && !isAuthenticated) {
    toast({
      title: "Acesso restrito",
      description: message || "Faça login para acessar esta página",
      variant: "destructive"
    });
    navigate(redirectUrl);
    return;
  }

  if (message) {
    toast({
      description: message,
      variant
    });
  }

  navigate(targetUrl);
};
