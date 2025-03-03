
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Instagram, Video, Users, ArrowRight } from 'lucide-react';

const CommunityHome: React.FC = () => {
  const navigate = useNavigate();

  const handleNextStep = () => {
    console.log("Navigating to next step: hub page");
    navigate('/community/hub');
  };

  return (
    <div className="pt-24 px-6">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">JESTFLY Community</h1>
      
      {/* Featured livestream banner */}
      <div className="mb-8 bg-gradient-to-r from-purple-900/40 to-black/40 backdrop-blur-md border border-purple-500/30 rounded-lg p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80 z-0"></div>
        <div className="absolute top-0 right-0 bottom-0 w-1/2 opacity-20 z-0">
          <img src="/assets/imagem1.jpg" alt="Livestream background" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center mb-2">
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center mr-2">
                <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span> COMING SOON
              </span>
              <span className="text-white/70 text-sm">Friday, 8:00 PM</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">New Album Livestream Premiere</h2>
            <p className="text-white/80 max-w-xl">Join JESTFLY for an exclusive first listen of the upcoming album, followed by a live Q&A session with fans.</p>
          </div>
          <Link to="/community/hub" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all text-white px-6 py-3 rounded-lg font-medium flex items-center">
            <Video className="mr-2" size={18} /> Set Reminder
          </Link>
        </div>
      </div>
      
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
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-4xl font-bold text-white z-10">JestFlyers Hub</h2>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Instagram className="text-white/20 w-32 h-32" />
            </div>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-white/20 px-4 py-2 rounded-full text-white backdrop-blur-md">
                Connect →
              </span>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Instagram feed preview */}
      <div className="mt-12 mb-6">
        <div className="flex items-center mb-6">
          <Instagram className="mr-3" size={24} />
          <h2 className="text-2xl font-bold text-white">Instagram Feed</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-white/10 relative group">
              <img src="/assets/imagem1.jpg" alt={`Instagram post ${item}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="text-white text-sm truncate">Latest updates from JESTFLY #Music</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <Link to="/community/hub" className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors">
            View all Instagram posts <span className="ml-2">→</span>
          </Link>
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <button 
          onClick={handleNextStep}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-medium flex items-center transition-colors"
        >
          Próximo Passo <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CommunityHome;
