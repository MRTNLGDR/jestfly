
import React from 'react';
import { Link } from 'react-router-dom';

const CommunityNav: React.FC = () => {
  return (
    <div className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-20 z-10">
      <div className="container mx-auto flex overflow-x-auto whitespace-nowrap py-4 px-6">
        <Link to="/community/hub" className="text-white/80 hover:text-white px-4 py-2 mr-4 transition-colors">
          JestFlyers Hub
        </Link>
        <Link to="/community" className="text-white/80 hover:text-white px-4 py-2 mr-4 transition-colors">
          All Community
        </Link>
        <Link to="/community/events" className="text-white/80 hover:text-white px-4 py-2 mr-4 transition-colors">
          Events
        </Link>
        <Link to="/community/giveaways" className="text-white/80 hover:text-white px-4 py-2 transition-colors">
          Giveaways
        </Link>
      </div>
    </div>
  );
};

export default CommunityNav;
