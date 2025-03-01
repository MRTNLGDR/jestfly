
import React, { useState } from 'react';
import { Video, User, Users, Instagram } from 'lucide-react';
import { Button } from '../components/ui/button';
import Footer from '../components/Footer';

const LiveStreamPage: React.FC = () => {
  const [isLive, setIsLive] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Fan123', message: 'Love the new tracks!', time: '2:05 PM' },
    { id: 2, user: 'MusicLover42', message: 'When is the album dropping?', time: '2:06 PM' },
    { id: 3, user: 'JestFlyFan', message: '🔥🔥🔥', time: '2:08 PM' },
    { id: 4, user: 'BeatMaster', message: 'That bass line is incredible', time: '2:10 PM' },
    { id: 5, user: 'Melody_Queen', message: 'Greetings from Brazil! 🇧🇷', time: '2:12 PM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: chatMessages.length + 1,
        user: 'You',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, newMsg]);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">JESTFLY Livestream</h1>
          {isLive ? (
            <div className="flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></span>
              <span className="text-red-500 font-medium">LIVE NOW</span>
            </div>
          ) : (
            <div className="text-gray-500">Offline</div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main video stream */}
          <div className="lg:col-span-2">
            <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden">
              <div className="aspect-video">
                {isLive ? (
                  <img 
                    src="/assets/imagem1.jpg" 
                    alt="Livestream" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <div className="text-center">
                      <Video className="mx-auto mb-3 text-gray-600" size={48} />
                      <p className="text-gray-400">Stream is currently offline</p>
                      <p className="text-gray-500 text-sm mt-2">Check back later or subscribe for notifications</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Video controls overlay */}
              {isLive && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
                      <button className="text-white hover:text-gray-300 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </button>
                      <div className="flex items-center space-x-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                        </svg>
                        <div className="w-20 h-1 bg-gray-600 rounded-full overflow-hidden">
                          <div className="w-3/4 h-full bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button className="text-white hover:text-gray-300 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                        </svg>
                      </button>
                      <button className="text-white hover:text-gray-300 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </button>
                      <button className="text-white hover:text-gray-300 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Stream info */}
            <div className="mt-4">
              <h2 className="text-xl font-bold">Studio Session - New Album Preview</h2>
              <div className="flex items-center mt-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <User size={18} />
                </div>
                <div className="ml-3">
                  <div className="text-white font-medium">JESTFLY Official</div>
                  <div className="text-white/60 text-xs">2.3M followers</div>
                </div>
                <Button className="ml-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Follow
                </Button>
              </div>
              <div className="mt-4 bg-gray-900/60 rounded-lg p-4">
                <p className="text-white/80">
                  Welcome to our studio session livestream! We're giving you a sneak peek at some tracks from our upcoming album. Drop your questions in the chat and we'll try to answer them during the Q&A segment.
                </p>
                <div className="flex items-center mt-4 text-sm text-white/60">
                  <div className="flex items-center mr-4">
                    <Users size={16} className="mr-1" />
                    <span>1.2K watching</span>
                  </div>
                  <div>Started streaming 45 minutes ago</div>
                </div>
              </div>
            </div>
            
            {/* Instagram cross-posting */}
            <div className="mt-6 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-lg p-4 border border-purple-500/30">
              <div className="flex items-center">
                <Instagram size={20} className="text-pink-400 mr-2" />
                <h3 className="text-white font-medium">Share to Instagram</h3>
                <Button size="sm" variant="outline" className="ml-auto text-xs border-white/20 text-white hover:bg-white/10">
                  Post Highlight
                </Button>
              </div>
            </div>
          </div>
          
          {/* Chat section */}
          <div className="bg-gray-900/60 rounded-lg overflow-hidden border border-white/10 flex flex-col h-[600px]">
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-medium">Live Chat</h3>
              <div className="flex items-center text-sm text-white/60">
                <Users size={16} className="mr-1" />
                <span>1.2K</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="flex">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xs flex-shrink-0">
                    {msg.user.charAt(0)}
                  </div>
                  <div className="ml-2">
                    <div className="flex items-baseline">
                      <span className="font-medium text-sm">{msg.user}</span>
                      <span className="ml-2 text-white/40 text-xs">{msg.time}</span>
                    </div>
                    <p className="text-white/80 text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10">
              <div className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-gray-800 border border-white/10 rounded-l-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none"
                  placeholder="Send a message..."
                />
                <Button type="submit" className="rounded-l-none">
                  Send
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Upcoming streams */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-4">Upcoming Livestreams</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((stream) => (
              <div key={stream} className="bg-gray-900/60 rounded-lg overflow-hidden border border-white/10 group hover:border-purple-500/50 transition-all">
                <div className="aspect-video bg-gray-800 relative">
                  <img src="/assets/imagem1.jpg" alt={`Stream preview ${stream}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                    <div>
                      <div className="text-white/70 text-xs">
                        {stream === 1 ? 'Tomorrow, 8:00 PM' : stream === 2 ? 'Saturday, 7:30 PM' : 'Sunday, 9:00 PM'}
                      </div>
                      <div className="font-medium text-white">
                        {stream === 1 ? 'Q&A Session' : stream === 2 ? 'Backstage Tour' : 'Music Producers Roundtable'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                      <User size={14} />
                    </div>
                    <div className="ml-2 text-sm">JESTFLY</div>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs border-white/20 text-white hover:bg-white/10">
                    Remind
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LiveStreamPage;
