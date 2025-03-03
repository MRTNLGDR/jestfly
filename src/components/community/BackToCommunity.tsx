
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const BackToCommunity: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="ghost" 
      className="mb-6 text-white/80 hover:text-white"
      onClick={() => navigate('/community')}
    >
      <ChevronLeft className="mr-2 h-4 w-4" />
      Voltar para Comunidade
    </Button>
  );
};

export default BackToCommunity;
