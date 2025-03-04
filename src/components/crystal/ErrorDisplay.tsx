
interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/90">
      <div className="text-red-500 text-2xl mb-4">Erro de carregamento</div>
      <div className="text-white text-lg">{error}</div>
    </div>
  );
};

export default ErrorDisplay;
