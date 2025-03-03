
import React from 'react';
import { Loader2 } from 'lucide-react';

const PostLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 w-full bg-black/20 backdrop-blur-sm rounded-lg border border-white/5 animate-pulse">
      <Loader2 className="h-8 w-8 animate-spin text-purple-500 mb-4" />
      <p className="text-white/60 text-sm">Carregando publicação...</p>
    </div>
  );
};

export default PostLoading;
