
import React, { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Heart, MessageCircle, Repeat, ArrowRight, Loader } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import CommunityNav from './CommunityNav';
import { useNavigate } from 'react-router-dom';

const JestFlyersHubPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Sample data for Instagram-like posts
  const instagramPosts = [
    {
      id: 1,
      username: '@jestfly',
      avatar: '/assets/avatar1.jpg',
      image: '/assets/image1.jpg',
      caption: 'Creating the future of immersive sound experiences #jestfly #music #futuristic',
      likes: 456,
      comments: 32,
      timestamp: '2h ago'
    },
    {
      id: 2,
      username: '@producer_jay',
      avatar: '/assets/avatar2.jpg',
      image: '/assets/image2.jpg',
      caption: 'Studio session with @jestfly - magic in the making 🔥',
      likes: 843,
      comments: 56,
      timestamp: '5h ago'
    },
    {
      id: 3,
      username: '@jestfly',
      avatar: '/assets/avatar1.jpg',
      image: '/assets/image3.jpg',
      caption: 'Next show announced! Get your tickets before they sell out #tour #music',
      likes: 1245,
      comments: 98,
      timestamp: '1d ago'
    },
    {
      id: 4,
      username: '@visual_artist',
      avatar: '/assets/avatar3.jpg',
      image: '/assets/image4.jpg',
      caption: 'Working on visual concepts for the upcoming @jestfly tour. Sneak peek!',
      likes: 721,
      comments: 42,
      timestamp: '2d ago'
    }
  ];

  useEffect(() => {
    // Simular carregamento mais rápido
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log("JestFlyers Hub content loaded");
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleNextStep = () => {
    console.log("Navigating to next step: events page");
    navigate('/community/events');
  };

  return (
    <div className="bg-gradient-to-b from-black to-purple-950 min-h-screen pt-20">
      <CommunityNav />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            JestFlyers Hub
          </h1>
          <p className="text-white/70">Connect with the community and see what's happening.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Estado de carregamento com skeletons
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="neo-blur rounded-xl overflow-hidden border border-white/10 p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="w-full aspect-square mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))
          ) : (
            // Conteúdo real
            instagramPosts.map((post) => (
              <div key={post.id} className="neo-blur rounded-xl overflow-hidden border border-white/10">
                {/* Post header */}
                <div className="p-4 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-bold">{post.username.charAt(1).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{post.username}</p>
                    <p className="text-xs text-white/60">{post.timestamp}</p>
                  </div>
                </div>
                
                {/* Post image */}
                <div className="aspect-square w-full bg-gradient-to-br from-purple-900/20 to-pink-900/20 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-2xl opacity-30"></div>
                  <p className="absolute text-white/80 font-medium">Image Preview</p>
                </div>
                
                {/* Post actions */}
                <div className="p-4 flex items-center space-x-6">
                  <button className="text-white/80 hover:text-pink-500 transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="text-white/80 hover:text-blue-500 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                  </button>
                  <button className="text-white/80 hover:text-green-500 transition-colors">
                    <Repeat className="h-5 w-5" />
                  </button>
                  <span className="text-xs text-white/60 ml-auto">{post.likes} likes</span>
                </div>
                
                {/* Caption */}
                <div className="px-4 pb-4">
                  <p className="text-white/90 text-sm">
                    <span className="font-medium">{post.username}</span>{' '}
                    {post.caption}
                  </p>
                  <p className="text-white/60 text-xs mt-2">View all {post.comments} comments</p>
                </div>
                
                {/* Badges */}
                <div className="px-4 pb-5 flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-purple-900/30 text-purple-400 border-purple-700/40">
                    #jestfly
                  </Badge>
                  <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-700/40">
                    #community
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-center mt-10">
          <button 
            onClick={handleNextStep}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-medium flex items-center transition-colors"
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-5 w-5 animate-spin" />
                Carregando...
              </>
            ) : (
              <>
                Próximo Passo <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JestFlyersHubPage;
