
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Tentativa de acesso a rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
          404
        </h1>
        
        <div className="glass-morphism p-8 rounded-xl">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Página não encontrada
          </h2>
          <p className="text-white/70 mb-6">
            A página que você está procurando não existe ou foi removida.
          </p>
          
          <Button asChild>
            <Link to="/" className="inline-flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Voltar para página inicial
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
