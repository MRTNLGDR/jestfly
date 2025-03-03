
import React from 'react';
import { Sparkles, Gift, Users, Calendar, Trophy } from 'lucide-react';
import GoldCoin3D from '../components/GoldCoin3D';
import Footer from '../components/Footer';

const AirdropPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Hero section */}
      <div className="relative overflow-hidden bg-black">
        {/* Background effects */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-20 w-[30vw] h-[30vw] rounded-full bg-yellow-500/10 blur-[100px]"></div>
          <div className="absolute bottom-20 left-20 w-[20vw] h-[20vw] rounded-full bg-purple-500/10 blur-[100px]"></div>
        </div>
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient">
                JestCoin Airdrop
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-xl">
                Join the JESTFLY community and earn exclusive rewards, royalties, and opportunities through our JestCoin airdrop program.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-lg font-medium shadow-lg shadow-yellow-600/20 hover:shadow-yellow-600/40 transition-all">
                  Claim Your Coins
                </button>
                <button className="px-6 py-3 bg-black/40 backdrop-blur-sm border border-yellow-500/50 rounded-lg font-medium hover:bg-black/60 transition-all">
                  Learn More
                </button>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-64 h-64">
                <GoldCoin3D size={256} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* How it works section */}
      <div className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">How JestCoin Rewards Work</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-card p-6 backdrop-blur-lg relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
              <div className="absolute -right-6 -top-6 w-16 h-16 bg-yellow-500/20 rounded-full blur-xl group-hover:bg-yellow-500/30 transition-all"></div>
              <Sparkles className="text-yellow-500 mb-4 h-8 w-8" />
              <h3 className="text-xl font-bold mb-2">Earn</h3>
              <p className="text-white/70">Complete tasks, engage with the community, and submit your music to earn JestCoins.</p>
            </div>
            
            <div className="glass-card p-6 backdrop-blur-lg relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
              <div className="absolute -right-6 -top-6 w-16 h-16 bg-purple-500/20 rounded-full blur-xl group-hover:bg-purple-500/30 transition-all"></div>
              <Gift className="text-purple-500 mb-4 h-8 w-8" />
              <h3 className="text-xl font-bold mb-2">Redeem</h3>
              <p className="text-white/70">Use your JestCoins to unlock exclusive content, merchandise, and opportunities.</p>
            </div>
            
            <div className="glass-card p-6 backdrop-blur-lg relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
              <div className="absolute -right-6 -top-6 w-16 h-16 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/30 transition-all"></div>
              <Users className="text-blue-500 mb-4 h-8 w-8" />
              <h3 className="text-xl font-bold mb-2">Network</h3>
              <p className="text-white/70">Connect with other artists and industry professionals in our exclusive community.</p>
            </div>
            
            <div className="glass-card p-6 backdrop-blur-lg relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
              <div className="absolute -right-6 -top-6 w-16 h-16 bg-green-500/20 rounded-full blur-xl group-hover:bg-green-500/30 transition-all"></div>
              <Trophy className="text-green-500 mb-4 h-8 w-8" />
              <h3 className="text-xl font-bold mb-2">Royalties</h3>
              <p className="text-white/70">Earn ongoing royalties from your contributions to the JESTFLY ecosystem.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Upcoming rewards */}
      <div className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Upcoming Reward Drops</h2>
          
          <div className="space-y-8">
            <div className="glass-card p-6 relative overflow-hidden group">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-yellow-900/30 rounded-lg">
                  <Calendar className="text-yellow-500 h-8 w-8" />
                </div>
                
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <h3 className="text-xl font-bold mb-2 md:mb-0">Mansion Livestream Access</h3>
                    <div className="mb-2 md:mb-0">
                      <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm">
                        1000 JestCoins
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-white/70 mt-2">
                    Get exclusive access to JESTFLY mansion livestream events featuring top artists and industry professionals.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6 relative overflow-hidden group">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-purple-900/30 rounded-lg">
                  <Calendar className="text-purple-500 h-8 w-8" />
                </div>
                
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <h3 className="text-xl font-bold mb-2 md:mb-0">Track Feedback Session</h3>
                    <div className="mb-2 md:mb-0">
                      <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                        2500 JestCoins
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-white/70 mt-2">
                    Submit your tracks for professional feedback from JESTFLY and network with other artists.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6 relative overflow-hidden group">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-blue-900/30 rounded-lg">
                  <Calendar className="text-blue-500 h-8 w-8" />
                </div>
                
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <h3 className="text-xl font-bold mb-2 md:mb-0">Limited Edition Merch Drop</h3>
                    <div className="mb-2 md:mb-0">
                      <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                        5000 JestCoins
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-white/70 mt-2">
                    Exclusive JESTFLY merchandise available only to JestCoin holders. Limited quantities available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AirdropPage;
