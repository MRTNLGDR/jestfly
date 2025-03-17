
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

const AdminLink: React.FC = () => {
  return (
    <div className="absolute top-4 right-4 z-30">
      <Link 
        to="/admin" 
        className="flex items-center gap-2 px-3 py-2 bg-black/70 hover:bg-black/90 rounded-md text-white transition-colors border border-white/10"
      >
        <Settings size={16} />
        Admin
      </Link>
    </div>
  );
};

export default AdminLink;
