
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PostNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-black/30 backdrop-blur-sm rounded-lg border border-red-500/20 text-center">
      <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
      <h2 className="text-xl font-bold text-white mb-2">Post não encontrado</h2>
      <p className="text-white/60 mb-6">Esta publicação pode ter sido removida ou não existe.</p>
      <Button 
        variant="outline" 
        className="border-white/20 text-white hover:bg-white/10"
        onClick={() => navigate('/community')}
      >
        Voltar para Comunidade
      </Button>
    </div>
  );
};

export default PostNotFound;
