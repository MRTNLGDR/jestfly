import React, { useState } from 'react';
import { Instagram, Video, Users, User } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

const JestFlyersHubPage = () => {
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);

  // Mock Instagram posts for demo
  const instagramPosts = [
    {
      id: 1,
      username: 'jestfly_official',
      image: '/assets/imagem1.jpg',
      caption: 'Getting ready for tonight's show! #JESTFLYLive',
      likes: 523,
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      username: 'jestfly_official',
      image: '/assets/imagem1.jpg',
      caption: 'New merch just dropped! Check out our store now 🔥 #MerchDrop',
      likes: 418,
      timestamp: '1 day ago'
    },
    {
      id: 3,
      username: 'jestfly_official',
      image: '/assets/imagem1.jpg',
      caption: 'Throwback to last week's amazing show! Thanks to everyone who came out!',
      likes: 612,
      timestamp: '4 days ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-cyan-900 pt-24 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white">JestFlyers Hub</h1>
        
        {/* Admin livestream control - only visible to admin */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-red-500 to-purple-500 hover:from-red-600 hover:to-purple-600">
              <Video className="mr-2" size={18} /> Go Live
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>Start Livestream</DialogTitle>
              <DialogDescription className="text-white/70">
                You're about to go live to all your followers. Get ready!
              </DialogDescription>
            </DialogHeader>
            <div className="my-4 bg-gray-900/60 rounded-lg p-4 aspect-video flex items-center justify-center">
              <div className="text-center">
                <Video className="mx-auto mb-2" size={48} />
                <p className="text-white/70">Your camera preview will appear here</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Cancel
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white" 
                onClick={() => setIsLiveStreaming(true)}
              >
                Start Livestream
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Active livestream banner - shows when artist is live */}
      {isLiveStreaming && (
        <div className="mb-8 bg-gradient-to-r from-red-900/40 to-purple-900/40 border border-red-500/30 rounded-lg p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                  <User size={32} />
                </div>
                <span className="absolute -top-1 -right-1 bg-red-500 rounded-full px-2 py-0.5 text-xs font-semibold animate-pulse">
                  LIVE
                </span>
              </div>
              <div className="ml-3">
                <h3 className="text-white font-bold">JESTFLY is now LIVE!</h3>
                <p className="text-white/70 text-sm">Studio Session - New Album Preview</p>
              </div>
            </div>
            <Button className="bg-red-600 hover:bg-red-700">
              Join Now
            </Button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Instagram Integration Section */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <Instagram className="mr-2" size={22} /> Instagram Feed
              </h2>
              <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                Connect Account
              </Button>
            </div>
            
            {/* Instagram Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {instagramPosts.map(post => (
                <div key={post.id} className="bg-black/60 rounded-lg overflow-hidden border border-white/10">
                  <div className="p-3 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <div className="ml-2">
                      <div className="text-white font-medium text-sm">{post.username}</div>
                    </div>
                  </div>
                  <div className="aspect-square bg-gray-800">
                    <img 
                      src={post.image} 
                      alt={`Instagram post by ${post.username}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex space-x-4 text-white/70 mb-2">
                      <button className="flex items-center space-x-1 hover:text-pink-400 transition-colors">
                        <span>❤️</span>
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                        <span>💬</span>
                        <span>Comment</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-green-400 transition-colors">
                        <span>🔄</span>
                        <span>Share</span>
                      </button>
                    </div>
                    <p className="text-white/90 text-sm">{post.caption}</p>
                    <p className="text-white/50 text-xs mt-1">{post.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Community Feed - keep existing but simplified */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <Users className="mr-2" size={22} /> Community Feed
            </h2>
            
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
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                  Post
                </Button>
              </div>
            </div>
            
            {/* Feed posts - just showing one example post */}
            <div className="bg-black/30 rounded-lg p-4 border border-white/10">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 mr-3"></div>
                <div>
                  <div className="text-white font-medium">JESTFLY Fan #1</div>
                  <div className="text-white/60 text-xs">3 hours ago</div>
                </div>
              </div>
              <p className="text-white/90 mb-4">
                Just got my tickets for the upcoming show! Who else is going to be there?
              </p>
              <div className="flex space-x-4 text-white/70">
                <button className="flex items-center space-x-1 hover:text-cyan-400 transition-colors">
                  <span>❤️</span>
                  <span>12</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-cyan-400 transition-colors">
                  <span>💬</span>
                  <span>1</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-cyan-400 transition-colors">
                  <span>🔄</span>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right sidebar section */}
        <div className="space-y-6">
          {/* Livestream section */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Video className="mr-2" size={18} /> JESTFLY Livestreams
            </h2>
            
            {isLiveStreaming ? (
              <div className="space-y-4">
                <div className="relative bg-black/60 rounded-lg overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                    <img src="/assets/imagem1.jpg" alt="Livestream preview" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button className="bg-red-600 hover:bg-red-700">
                        <Video className="mr-2" size={16} /> Watch Now
                      </Button>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span> LIVE
                  </div>
                </div>
                <p className="text-white font-medium">Studio Session - New Album Preview</p>
                <p className="text-white/70 text-sm">Started 15 minutes ago - 1.2k viewers</p>
              </div>
            ) : (
              <div className="text-center py-6 text-white/70">
                <Video className="mx-auto mb-2 opacity-50" size={40} />
                <p className="mb-1">No active livestreams</p>
                <p className="text-sm">Check back later or follow for notifications</p>
              </div>
            )}
            
            <div className="mt-4">
              <h3 className="text-white/90 font-medium mb-2">Upcoming Livestreams</h3>
              <div className="space-y-3">
                <div className="bg-black/30 p-3 rounded-lg flex items-center">
                  <div className="w-12 h-12 rounded bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center mr-3">
                    <Video size={20} />
                  </div>
                  <div>
                    <p className="text-white font-medium">Q&A Session</p>
                    <p className="text-white/60 text-xs">Tomorrow, 8:00 PM</p>
                  </div>
                </div>
                <div className="bg-black/30 p-3 rounded-lg flex items-center">
                  <div className="w-12 h-12 rounded bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center mr-3">
                    <Video size={20} />
                  </div>
                  <div>
                    <p className="text-white font-medium">Backstage Tour</p>
                    <p className="text-white/60 text-xs">Saturday, 7:30 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Community Stats - keep existing */}
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
          
          {/* Trending Tags - keep existing */}
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
};

export default JestFlyersHubPage;
