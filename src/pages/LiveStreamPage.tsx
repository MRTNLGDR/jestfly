
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../components/ui/tooltip';
import Footer from '../components/Footer';
import { 
  Video, Mic, MicOff, Camera, CameraOff, 
  Cast, Facebook, Instagram, Youtube, 
  MessageSquare, Users, Settings, Info
} from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

interface Comment {
  id: string;
  platform: 'facebook' | 'instagram' | 'youtube' | 'app';
  author: string;
  content: string;
  timestamp: Date;
  avatar?: string;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    platform: 'facebook',
    author: 'Mark Johnson',
    content: 'Awesome set! 🔥',
    timestamp: new Date(Date.now() - 120000),
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    platform: 'instagram',
    author: 'dj_maria',
    content: 'Love the new tracks!',
    timestamp: new Date(Date.now() - 80000),
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '3',
    platform: 'youtube',
    author: 'ElectroFan99',
    content: 'What\'s the name of this track?',
    timestamp: new Date(Date.now() - 45000),
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
  },
  {
    id: '4',
    platform: 'app',
    author: 'JESTFLYer',
    content: 'Streaming quality is amazing!',
    timestamp: new Date(Date.now() - 20000),
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
  },
];

const LiveStreamPage: React.FC = () => {
  const { t } = useLanguage();
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [viewers, setViewers] = useState({ facebook: 0, instagram: 0, youtube: 0, app: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  
  useEffect(() => {
    // Initialize with mock comments
    setComments(MOCK_COMMENTS);
    
    // Mock viewer counts
    const viewerInterval = setInterval(() => {
      setViewers(prev => ({
        facebook: prev.facebook + (Math.random() > 0.5 ? 1 : 0),
        instagram: prev.instagram + (Math.random() > 0.5 ? 1 : 0),
        youtube: prev.youtube + (Math.random() > 0.5 ? 1 : 0),
        app: prev.app + (Math.random() > 0.7 ? 1 : 0),
      }));
    }, 5000);
    
    // Mock comment stream
    const commentInterval = setInterval(() => {
      if (isStreaming) {
        const platforms = ['facebook', 'instagram', 'youtube', 'app'] as const;
        const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
        
        const newComment: Comment = {
          id: Date.now().toString(),
          platform: randomPlatform,
          author: `User${Math.floor(Math.random() * 1000)}`,
          content: [
            'Great music!', 
            'Love the vibes!', 
            'Where\'s your next show?', 
            '🔥🔥🔥', 
            'Can you play some techno?',
            'Greetings from Brazil!',
            'This drop is insane',
            'Following you now!'
          ][Math.floor(Math.random() * 8)],
          timestamp: new Date(),
          avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70)}.jpg`,
        };
        
        setComments(prev => [newComment, ...prev].slice(0, 50));
      }
    }, 8000);
    
    return () => {
      clearInterval(viewerInterval);
      clearInterval(commentInterval);
      stopMediaStream();
    };
  }, [isStreaming]);
  
  const startMediaStream = async () => {
    try {
      const constraints = {
        audio: isMicOn,
        video: isCameraOn ? { width: 1280, height: 720 } : false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      return true;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      return false;
    }
  };
  
  const stopMediaStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };
  
  const toggleStreaming = async () => {
    if (!isStreaming) {
      // Start streaming
      const success = await startMediaStream();
      if (success) {
        setIsStreaming(true);
      }
    } else {
      // Stop streaming
      stopMediaStream();
      setIsStreaming(false);
    }
  };
  
  const togglePlatform = (platform: string) => {
    setConnectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };
  
  const toggleMic = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMicOn;
      });
    }
    setIsMicOn(!isMicOn);
  };
  
  const toggleCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !isCameraOn;
      });
    }
    setIsCameraOn(!isCameraOn);
  };
  
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      default:
        return <MessageSquare className="h-5 w-5" />;
    }
  };
  
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-blue-900 text-white">
      <div className="container mx-auto pt-32 px-4 pb-20">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{t('live.title')}</h1>
          <p className="text-xl text-blue-300 mb-2">{t('live.connect')}</p>
          <p className="text-white/70 max-w-2xl mx-auto">{t('live.platforms')}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main stream area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
              <div className="aspect-video bg-black relative">
                {isStreaming ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  ></video>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Cast className="h-20 w-20 text-white/20 mb-4" />
                    <p className="text-white/50 text-lg">Your stream will appear here</p>
                  </div>
                )}
                
                {/* Stream info overlay */}
                {isStreaming && (
                  <>
                    <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full flex items-center">
                      <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse mr-2"></span>
                      <span className="text-sm font-medium">LIVE</span>
                    </div>
                    
                    <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">
                        {Object.values(viewers).reduce((a, b) => a + b, 0)} viewers
                      </span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={toggleMic}
                    variant="outline"
                    className={`border ${isMicOn ? 'border-blue-500' : 'border-red-500'}`}
                    size="sm"
                  >
                    {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    onClick={toggleCamera}
                    variant="outline"
                    className={`border ${isCameraOn ? 'border-blue-500' : 'border-red-500'}`}
                    size="sm"
                  >
                    {isCameraOn ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                  </Button>
                  
                  <div className="h-8 mx-2 border-l border-white/20"></div>
                  
                  {['facebook', 'instagram', 'youtube'].map((platform) => (
                    <TooltipProvider key={platform}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => togglePlatform(platform)}
                            variant="outline"
                            size="sm"
                            className={`border ${connectedPlatforms.includes(platform) ? 'border-green-500 bg-green-900/20' : 'border-white/20'}`}
                          >
                            {getPlatformIcon(platform)}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-black/90 border border-blue-500 text-white">
                          {connectedPlatforms.includes(platform) 
                            ? `Disconnect from ${platform}` 
                            : `Connect to ${platform}`}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
                
                <Button
                  onClick={toggleStreaming}
                  className={isStreaming 
                    ? "bg-red-600 hover:bg-red-700" 
                    : "bg-blue-600 hover:bg-blue-700"}
                >
                  <Video className="h-5 w-5 mr-2" />
                  {isStreaming ? "End Stream" : t('live.start')}
                </Button>
              </div>
            </div>
            
            {/* Stream stats */}
            <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Stream Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-black/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">App</span>
                    <span className="text-white font-medium">{viewers.app}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1">
                    <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${(viewers.app / (Object.values(viewers).reduce((a, b) => a + b, 0) || 1)) * 100}%` }}></div>
                  </div>
                </div>
                
                <div className="p-3 bg-black/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">Facebook</span>
                    <span className="text-white font-medium">{viewers.facebook}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1">
                    <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${(viewers.facebook / (Object.values(viewers).reduce((a, b) => a + b, 0) || 1)) * 100}%` }}></div>
                  </div>
                </div>
                
                <div className="p-3 bg-black/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">Instagram</span>
                    <span className="text-white font-medium">{viewers.instagram}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1">
                    <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${(viewers.instagram / (Object.values(viewers).reduce((a, b) => a + b, 0) || 1)) * 100}%` }}></div>
                  </div>
                </div>
                
                <div className="p-3 bg-black/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">YouTube</span>
                    <span className="text-white font-medium">{viewers.youtube}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1">
                    <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${(viewers.youtube / (Object.values(viewers).reduce((a, b) => a + b, 0) || 1)) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Comment section */}
          <div className="space-y-6">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden flex flex-col h-[600px]">
              <Tabs defaultValue="all" className="w-full flex-1 flex flex-col">
                <div className="px-4 pt-4">
                  <h3 className="text-lg font-medium mb-3">{t('live.comments')}</h3>
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="facebook">{t('live.facebook')}</TabsTrigger>
                    <TabsTrigger value="instagram">{t('live.instagram')}</TabsTrigger>
                    <TabsTrigger value="youtube">{t('live.youtube')}</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="all" className="flex-1 flex flex-col mt-0">
                  <div className="p-4 flex-1 overflow-y-auto space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3">
                        <div className="relative">
                          <img 
                            src={comment.avatar || `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 70)}.jpg`} 
                            alt={comment.author} 
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-black">
                            {getPlatformIcon(comment.platform)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-xs text-white/50">{formatTimestamp(comment.timestamp)}</span>
                          </div>
                          <p className="text-white/80">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-white/10">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500"
                      />
                      <Button variant="ghost" className="bg-blue-600 hover:bg-blue-700 px-3">
                        <MessageSquare className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="facebook" className="flex-1 flex flex-col mt-0">
                  <div className="p-4 flex-1 overflow-y-auto space-y-4">
                    {comments.filter(c => c.platform === 'facebook').map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3">
                        <div className="relative">
                          <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full" />
                          <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-black">
                            <Facebook className="h-4 w-4 text-blue-500" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-xs text-white/50">{formatTimestamp(comment.timestamp)}</span>
                          </div>
                          <p className="text-white/80">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-white/10">
                    <div className="rounded-lg bg-white/10 p-3 text-center text-white/60">
                      <Facebook className="h-5 w-5 inline-block mr-2" />
                      Comments are synchronized from Facebook
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="instagram" className="flex-1 flex flex-col mt-0">
                  <div className="p-4 flex-1 overflow-y-auto space-y-4">
                    {comments.filter(c => c.platform === 'instagram').map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3">
                        <div className="relative">
                          <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full" />
                          <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-black">
                            <Instagram className="h-4 w-4 text-pink-500" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-xs text-white/50">{formatTimestamp(comment.timestamp)}</span>
                          </div>
                          <p className="text-white/80">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-white/10">
                    <div className="rounded-lg bg-white/10 p-3 text-center text-white/60">
                      <Instagram className="h-5 w-5 inline-block mr-2" />
                      Comments are synchronized from Instagram
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="youtube" className="flex-1 flex flex-col mt-0">
                  <div className="p-4 flex-1 overflow-y-auto space-y-4">
                    {comments.filter(c => c.platform === 'youtube').map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3">
                        <div className="relative">
                          <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full" />
                          <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-black">
                            <Youtube className="h-4 w-4 text-red-500" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-xs text-white/50">{formatTimestamp(comment.timestamp)}</span>
                          </div>
                          <p className="text-white/80">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-white/10">
                    <div className="rounded-lg bg-white/10 p-3 text-center text-white/60">
                      <Youtube className="h-5 w-5 inline-block mr-2" />
                      Comments are synchronized from YouTube
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Connection Guide</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="bg-blue-900/30 p-2 rounded-lg">
                    <div className="h-6 w-6 text-blue-400 flex items-center justify-center font-bold">1</div>
                  </div>
                  <div>
                    <p className="font-medium">Connect Your Accounts</p>
                    <p className="text-sm text-white/70">Link your social media accounts in settings</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="bg-blue-900/30 p-2 rounded-lg">
                    <div className="h-6 w-6 text-blue-400 flex items-center justify-center font-bold">2</div>
                  </div>
                  <div>
                    <p className="font-medium">Select Platforms</p>
                    <p className="text-sm text-white/70">Choose where you want to broadcast</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="bg-blue-900/30 p-2 rounded-lg">
                    <div className="h-6 w-6 text-blue-400 flex items-center justify-center font-bold">3</div>
                  </div>
                  <div>
                    <p className="font-medium">Start Streaming</p>
                    <p className="text-sm text-white/70">Press the Start Stream button to go live on all platforms</p>
                  </div>
                </div>
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configure Stream Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 rounded-full h-14 w-14 flex items-center justify-center">
              <Info className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-black/90 border border-blue-500 text-white max-w-md p-4">
            <h3 className="font-bold mb-2">Live Streaming Help</h3>
            <p className="text-sm mb-2">
              Stream directly to your fans and simultaneously broadcast to Facebook, Instagram, and YouTube.
            </p>
            <p className="text-sm">
              Comments from all platforms are synchronized in one place, making it easy to interact with your audience.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Footer />
    </div>
  );
};

export default LiveStreamPage;
