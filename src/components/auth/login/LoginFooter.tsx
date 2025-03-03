
import React from 'react';
import { Link } from 'react-router-dom';
import { CardFooter } from "../../ui/card";

export const LoginFooter: React.FC = () => {
  return (
    <CardFooter className="flex justify-center border-t border-zinc-800/30 pt-6">
      <p className="text-sm text-zinc-400">
        Não tem uma conta?{' '}
        <Link to="/register" className="text-purple-400 hover:text-purple-300 hover:underline">
          Cadastre-se
        </Link>
      </p>
    </CardFooter>
  );
};
