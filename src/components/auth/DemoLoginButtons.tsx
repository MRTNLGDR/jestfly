
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserIcon, PencilIcon, ShieldIcon } from 'lucide-react';

interface DemoLoginButtonsProps {
  onFanLogin: () => Promise<void>;
  onArtistLogin: () => Promise<void>;
  onAdminLogin?: () => Promise<void>;
  disabled: boolean;
}

const DemoLoginButtons: React.FC<DemoLoginButtonsProps> = ({ 
  onFanLogin, 
  onArtistLogin,
  onAdminLogin,
  disabled 
}) => {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/10"></span>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-black px-2 text-white/60">Ou use as contas de demonstração</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Button 
          variant="outline" 
          className="w-full border-purple-500/30 hover:bg-purple-900/30 text-sm"
          onClick={onFanLogin}
          disabled={disabled}
        >
          <UserIcon className="mr-1 h-3 w-3" />
          Demo Fã
        </Button>
        <Button 
          variant="outline" 
          className="w-full border-blue-500/30 hover:bg-blue-900/30 text-sm"
          onClick={onArtistLogin}
          disabled={disabled}
        >
          <PencilIcon className="mr-1 h-3 w-3" />
          Demo Artista
        </Button>
      </div>
      
      {onAdminLogin && (
        <div className="mt-2">
          <Button 
            variant="outline" 
            className="w-full border-red-500/30 hover:bg-red-900/30 text-sm"
            onClick={onAdminLogin}
            disabled={disabled}
          >
            <ShieldIcon className="mr-1 h-3 w-3" />
            Demo Admin
          </Button>
        </div>
      )}
    </div>
  );
};

export default DemoLoginButtons;
