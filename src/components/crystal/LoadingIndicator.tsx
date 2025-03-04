
import { Loader2 } from "lucide-react";

interface LoadingIndicatorProps {
  isLoading: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/70 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
        <div className="text-white text-xl">Carregando modelo...</div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
