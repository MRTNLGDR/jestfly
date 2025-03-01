
import React from 'react';
import { Rocket, Music, Gamepad2, Share2, Users, Gift } from 'lucide-react';

const RoadmapSection = () => {
  return (
    <section className="w-full py-20 relative overflow-hidden bg-black">
      {/* Background gradients */}
      <div className="absolute -top-60 -left-60 w-[600px] h-[600px] rounded-full bg-purple-900/10 blur-[150px]"></div>
      <div className="absolute -bottom-60 -right-60 w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-[150px]"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tighter">
            <span className="text-gradient-primary">ROADMAP</span> & FUTURE FEATURES
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Our vision for JESTFLY extends beyond what you see today. Here's what we're working on next.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Music Integration */}
          <div className="neo-blur rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all group">
            <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br from-pink-600 to-purple-900 group-hover:scale-105 transition-transform">
              <Music className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Music Platform Integration</h3>
            <p className="text-white/70 mb-4">
              Connect with Beatport, Amazon Music, and SoundCloud to sync music, play previews, and let artists import their tracks.
            </p>
            <div className="text-xs text-white/50 uppercase tracking-wider">Coming Soon</div>
          </div>
          
          {/* Runner Game */}
          <div className="neo-blur rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all group">
            <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-700 group-hover:scale-105 transition-transform">
              <Gamepad2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">DJ Collect Run Game</h3>
            <p className="text-white/70 mb-4">
              A stylized runner game where a fashionable DJ collects JestCoins for real prizes, including event tickets and exclusive NFTs.
            </p>
            <div className="text-xs text-white/50 uppercase tracking-wider">In Development</div>
          </div>
          
          {/* Social Sharing System */}
          <div className="neo-blur rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all group">
            <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br from-green-600 to-emerald-800 group-hover:scale-105 transition-transform">
              <Share2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Rewards & Airdrop System</h3>
            <p className="text-white/70 mb-4">
              Share content on social media to earn JestCoins, which can be redeemed for tickets, NFTs, and VIP access.
            </p>
            <div className="text-xs text-white/50 uppercase tracking-wider">Planned Q3 2023</div>
          </div>
          
          {/* Community Hub */}
          <div className="neo-blur rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all group">
            <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br from-orange-600 to-red-800 group-hover:scale-105 transition-transform">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Interactive Community Hub</h3>
            <p className="text-white/70 mb-4">
              A social space for fans to interact, share content, and participate in missions to earn rewards through gamification.
            </p>
            <div className="text-xs text-white/50 uppercase tracking-wider">Coming Soon</div>
          </div>
          
          {/* NFT Loot Boxes */}
          <div className="neo-blur rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all group">
            <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br from-yellow-600 to-amber-800 group-hover:scale-105 transition-transform">
              <Gift className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">NFT Loot Boxes</h3>
            <p className="text-white/70 mb-4">
              Complete missions to earn NFT loot boxes containing JestCoins, VIP tickets, exclusive music, and game skins.
            </p>
            <div className="text-xs text-white/50 uppercase tracking-wider">Planned Q4 2023</div>
          </div>
          
          {/* DJ Studio */}
          <div className="neo-blur rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all group">
            <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-900 group-hover:scale-105 transition-transform">
              <Rocket className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Browser DJ Studio</h3>
            <p className="text-white/70 mb-4">
              Mix music directly in the browser with an interactive DJ Pad, and sell popular remixes as exclusive NFTs.
            </p>
            <div className="text-xs text-white/50 uppercase tracking-wider">Future Vision</div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <button className="group px-6 py-3 rounded-full bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-600 hover:to-blue-600 transition-all text-white font-medium">
            Learn More About Our Vision
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
