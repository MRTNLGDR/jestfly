
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const GiveawaysPage = () => {
  const navigate = useNavigate();

  const handleNextStep = () => {
    console.log("Navigating to next step: community home");
    navigate('/community');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-pink-900 pt-24 px-6">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">Active Giveaways</h1>
      <div className="space-y-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden hover:border-pink-500 transition-all p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/4 aspect-square bg-gradient-to-br from-pink-800 to-purple-900 rounded-lg flex items-center justify-center">
                <span className="text-4xl">{item === 1 ? "🎧" : item === 2 ? "🎟️" : "👕"}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start flex-wrap">
                  <h3 className="text-xl font-semibold text-white">
                    {item === 1 ? "Limited Edition Headphones" : item === 2 ? "VIP Concert Tickets" : "Exclusive Merch Bundle"}
                  </h3>
                  <div className="bg-pink-900/60 text-pink-200 px-3 py-1 rounded-full text-xs">
                    {`${5-item} days left`}
                  </div>
                </div>
                <p className="text-white/70 mt-2">
                  Enter for a chance to win this exclusive {item === 1 ? "limited edition headphones set" : item === 2 ? "pair of VIP tickets to our next concert" : "merch bundle featuring our latest designs"}
                </p>
                <div className="mt-4">
                  <div className="text-white/80 text-sm mb-1">Entry Progress</div>
                  <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                    <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${20 * item}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-white/60">
                    <span>{item * 124} entries</span>
                    <span>Goal: 500 entries</span>
                  </div>
                </div>
                <button className="mt-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-2 rounded-full transition-colors">
                  Enter Giveaway
                </button>
              </div>
            </div>
          </div>
        ))}
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

export default GiveawaysPage;
