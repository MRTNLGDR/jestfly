
import React from 'react';
import { Link } from 'react-router-dom';

const CommunityHome: React.FC = () => {
  return (
    <div className="pt-24 px-6">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">JESTFLY Community</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link to="/community/events" className="block group">
          <div className="aspect-video bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg flex items-center justify-center relative overflow-hidden border border-white/10 group-hover:border-purple-500 transition-all">
            <h2 className="text-4xl font-bold text-white">Events</h2>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-white/20 px-4 py-2 rounded-full text-white backdrop-blur-md">
                Discover →
              </span>
            </div>
          </div>
        </Link>
        <Link to="/community/giveaways" className="block group">
          <div className="aspect-video bg-gradient-to-br from-pink-900 to-purple-900 rounded-lg flex items-center justify-center relative overflow-hidden border border-white/10 group-hover:border-pink-500 transition-all">
            <h2 className="text-4xl font-bold text-white">Giveaways</h2>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-white/20 px-4 py-2 rounded-full text-white backdrop-blur-md">
                Enter →
              </span>
            </div>
          </div>
        </Link>
        <Link to="/community/hub" className="block group">
          <div className="aspect-video bg-gradient-to-br from-cyan-900 to-blue-900 rounded-lg flex items-center justify-center relative overflow-hidden border border-white/10 group-hover:border-cyan-500 transition-all">
            <h2 className="text-4xl font-bold text-white">JestFlyers Hub</h2>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-white/20 px-4 py-2 rounded-full text-white backdrop-blur-md">
                Connect →
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CommunityHome;
