
import React from 'react';

const JestFlyersHubPage = () => (
  <div className="min-h-screen bg-gradient-to-b from-black to-cyan-900 pt-24 px-6">
    <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">JestFlyers Hub</h1>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Community Feed</h2>
          
          {/* Post creation */}
          <div className="bg-black/30 rounded-lg p-4 mb-6">
            <textarea 
              className="w-full bg-transparent border border-white/20 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500"
              placeholder="Share something with the community..."
              rows={3}
            ></textarea>
            <div className="flex justify-between mt-3">
              <div className="flex space-x-2">
                <button className="bg-transparent hover:bg-white/10 text-white p-2 rounded-lg transition-colors">
                  📷
                </button>
                <button className="bg-transparent hover:bg-white/10 text-white p-2 rounded-lg transition-colors">
                  🎵
                </button>
                <button className="bg-transparent hover:bg-white/10 text-white p-2 rounded-lg transition-colors">
                  📍
                </button>
              </div>
              <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                Post
              </button>
            </div>
          </div>
          
          {/* Feed posts */}
          {[1, 2, 3].map((post) => (
            <div key={post} className="bg-black/30 rounded-lg p-4 border border-white/10">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 mr-3"></div>
                <div>
                  <div className="text-white font-medium">JESTFLY Fan #{post}</div>
                  <div className="text-white/60 text-xs">3 hour{post > 1 ? "s" : ""} ago</div>
                </div>
              </div>
              <p className="text-white/90 mb-4">
                {post === 1 
                  ? "Just got my tickets for the upcoming show! Who else is going to be there?" 
                  : post === 2 
                  ? "This new track is absolutely fire! Been on repeat all day 🔥" 
                  : "Check out my collection of JESTFLY merch! Can't wait for the next drop"}
              </p>
              {post === 3 && (
                <div className="mb-4 grid grid-cols-2 gap-2">
                  <div className="aspect-square bg-gradient-to-br from-purple-800 to-pink-600 rounded-lg"></div>
                  <div className="aspect-square bg-gradient-to-br from-blue-800 to-cyan-600 rounded-lg"></div>
                </div>
              )}
              <div className="flex space-x-4 text-white/70">
                <button className="flex items-center space-x-1 hover:text-cyan-400 transition-colors">
                  <span>❤️</span>
                  <span>{post * 5 + 7}</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-cyan-400 transition-colors">
                  <span>💬</span>
                  <span>{post}</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-cyan-400 transition-colors">
                  <span>🔄</span>
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Community Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/70">Members</span>
              <span className="text-white font-medium">12,458</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Online Now</span>
              <span className="text-white font-medium">347</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Posts Today</span>
              <span className="text-white font-medium">89</span>
            </div>
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Top Contributors</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((user) => (
              <div key={user} className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 mr-3"></div>
                <div className="flex-1">
                  <div className="text-white font-medium">JESTFLY Fan #{user}</div>
                  <div className="text-white/60 text-xs">{user * 120 + 500} JestCoins</div>
                </div>
                <div className="text-cyan-400 font-bold">#{user}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Trending Tags</h2>
          <div className="flex flex-wrap gap-2">
            <div className="bg-cyan-900/60 text-cyan-200 px-3 py-1 rounded-full text-sm">#JESTFLYLive</div>
            <div className="bg-cyan-900/60 text-cyan-200 px-3 py-1 rounded-full text-sm">#NewMusicFriday</div>
            <div className="bg-cyan-900/60 text-cyan-200 px-3 py-1 rounded-full text-sm">#MerchDrop</div>
            <div className="bg-cyan-900/60 text-cyan-200 px-3 py-1 rounded-full text-sm">#ConcertMemories</div>
            <div className="bg-cyan-900/60 text-cyan-200 px-3 py-1 rounded-full text-sm">#JESTCommunity</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default JestFlyersHubPage;
