
import React from 'react';
import { Link } from 'react-router-dom';

const HeaderLogo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center">
      <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
        JESTFLY
      </span>
    </Link>
  );
};

export default HeaderLogo;
