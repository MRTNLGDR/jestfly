
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Footer from '../components/Footer';

// Community sub-pages
const EventsPage = () => (
  <div className="min-h-screen bg-gradient-to-b from-black to-purple-900 pt-24 px-6">
    <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">Upcoming Events</h1>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden hover:border-purple-500 transition-all p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 aspect-video bg-gradient-to-br from-purple-800 to-blue-900 rounded-lg flex items-center justify-center">
              <span className="text-4xl">🎉</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-white">JESTFLY Live Show #{item}</h3>
                <div className="bg-purple-900/60 text-purple-200 px-3 py-1 rounded-full text-xs">
                  {item < 3 ? "Upcoming" : "Tickets Available"}
                </div>
              </div>
              <p className="text-white/70 mt-2">Join us for an unforgettable night of music and visuals</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-sm">July 2{item}, 2023</div>
                <div className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-sm">9:00 PM</div>
                <div className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-sm">Club Neon</div>
              </div>
              <button className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-full transition-colors">
                Get Tickets
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const GiveawaysPage = () => (
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
  </div>
);

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

const CommunityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Community Nav */}
      <div className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-20 z-10">
        <div className="container mx-auto flex overflow-x-auto whitespace-nowrap py-4 px-6">
          <Link to="/community" className="text-white/80 hover:text-white px-4 py-2 mr-4 transition-colors">
            All Community
          </Link>
          <Link to="/community/events" className="text-white/80 hover:text-white px-4 py-2 mr-4 transition-colors">
            Events
          </Link>
          <Link to="/community/giveaways" className="text-white/80 hover:text-white px-4 py-2 mr-4 transition-colors">
            Giveaways
          </Link>
          <Link to="/community/hub" className="text-white/80 hover:text-white px-4 py-2 transition-colors">
            JestFlyers Hub
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto pb-20">
        <Routes>
          <Route path="/" element={
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
          } />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/giveaways" element={<GiveawaysPage />} />
          <Route path="/hub" element={<JestFlyersHubPage />} />
        </Routes>
      </div>
      
      <Footer />
    </div>
  );
};

export default CommunityPage;
