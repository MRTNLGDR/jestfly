
import React from 'react';
import { Link } from 'react-router-dom';
import { Diamond } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center">
      <Diamond className="h-6 w-6 sm:h-8 sm:w-8 text-white glow-purple" />
    </Link>
  );
};

export default Logo;
