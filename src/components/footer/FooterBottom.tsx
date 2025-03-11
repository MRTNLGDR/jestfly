
import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FooterBottomProps {
  onAdminDialogOpen: () => void;
}

const FooterBottom: React.FC<FooterBottomProps> = ({ onAdminDialogOpen }) => {
  return (
    <>
      <div className="w-full h-px bg-white/10 my-10"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-center text-white/40 text-xs">
        <div>© 2023 JESTFLY. All rights reserved.</div>
        
        <div className="flex space-x-6 mt-4 md:mt-0 items-center">
          <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
          <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
          <a href="#" className="hover:text-white/60 transition-colors">Cookies</a>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onAdminDialogOpen}
            className="ml-2 text-xs bg-gray-900/30 hover:bg-gray-900/50 border-gray-700/50 text-white/70 flex items-center gap-1 h-7 px-2"
          >
            <Lock className="h-3 w-3 opacity-70" />
            <span>Admin</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default FooterBottom;
