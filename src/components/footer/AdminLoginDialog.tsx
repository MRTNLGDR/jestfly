
import React, { useState } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const AdminLoginDialog: React.FC<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ isOpen, onOpenChange }) => {
  const { signIn } = useAuth();
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (demoType: 'admin' | 'artist' | 'collaborator' | 'fan') => {
    setIsLoading(true);
    setLoginError('');
    
    const demoAccounts = {
      admin: { email: 'admin@jestfly.com', password: 'admin123' },
      artist: { email: 'artist@jestfly.com', password: 'artist123' },
      collaborator: { email: 'collaborator@jestfly.com', password: 'collab123' },
      fan: { email: 'fan@jestfly.com', password: 'fan123' }
    };
    
    try {
      const { email, password } = demoAccounts[demoType];
      const { error } = await signIn(email, password);
      
      if (error) {
        setLoginError(error.message);
      } else {
        onOpenChange(false);
      }
    } catch (error) {
      setLoginError('Falha ao realizar login. Tente novamente.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-center mb-2">Acesso Rápido</DialogTitle>
          <DialogDescription className="text-center text-white/60">
            Selecione uma conta para login automático
          </DialogDescription>
        </DialogHeader>
        
        {loginError && (
          <div className="bg-red-900/30 border border-red-800/50 text-red-200 p-3 rounded-md text-sm mb-4">
            {loginError}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="bg-gray-900/20 hover:bg-gray-900/40 border-gray-700/50 text-white"
            onClick={() => handleAdminLogin('admin')}
            disabled={isLoading}
          >
            Admin
          </Button>
          <Button
            variant="outline"
            className="bg-gray-900/20 hover:bg-gray-900/40 border-gray-700/50 text-white"
            onClick={() => handleAdminLogin('artist')}
            disabled={isLoading}
          >
            Artista
          </Button>
          <Button
            variant="outline"
            className="bg-gray-900/20 hover:bg-gray-900/40 border-gray-700/50 text-white"
            onClick={() => handleAdminLogin('collaborator')}
            disabled={isLoading}
          >
            Colaborador
          </Button>
          <Button
            variant="outline"
            className="bg-gray-900/20 hover:bg-gray-900/40 border-gray-700/50 text-white"
            onClick={() => handleAdminLogin('fan')}
            disabled={isLoading}
          >
            Fã
          </Button>
        </div>
        
        <div className="mt-2 text-center text-xs text-white/40">
          Acesso temporário para fins de demonstração
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginDialog;
