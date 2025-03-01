import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, X, Disc } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface SoundCloudPlayerProps {
  isMinimized: boolean;
  setIsMinimized: (value: boolean) => void;
}

const SoundCloudPlayer: React.FC<SoundCloudPlayerProps> = ({ 
  isMinimized, 
  setIsMinimized 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLIFrameElement>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const targetVolume = 0.7; // Target volume level
  const location = useLocation();
  
  // Reset player when route changes
  useEffect(() => {
    if (isMinimized) return;
    // Keep current state when minimized
  }, [location.pathname, isMinimized]);

  // Handle fade in effect when playing
  useEffect(() => {
    if (isPlaying) {
      // Start with very low volume
      setVolume(0);
      
      // Clear any existing interval
      if (fadeIntervalRef.current) {
        window.clearInterval(fadeIntervalRef.current);
      }
      
      // Gradually increase volume
      fadeIntervalRef.current = window.setInterval(() => {
        setVolume(prevVolume => {
          const newVolume = prevVolume + 0.05;
          if (newVolume >= targetVolume) {
            if (fadeIntervalRef.current) {
              window.clearInterval(fadeIntervalRef.current);
              fadeIntervalRef.current = null;
            }
            return targetVolume;
          }
          return newVolume;
        });
      }, 200); // Update every 200ms for a smooth fade
    } else {
      // Stop fade and reset volume when paused
      if (fadeIntervalRef.current) {
        window.clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
      setVolume(0);
    }
    
    return () => {
      // Cleanup interval on component unmount
      if (fadeIntervalRef.current) {
        window.clearInterval(fadeIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // Handle playing and pausing
  const togglePlay = () => {
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);
    
    // When pausing, minimize the player
    if (!newPlayState && !isMinimized) {
      setIsMinimized(true);
    }
    
    // Interact with SoundCloud iframe API
    try {
      const iframe = audioRef.current;
      if (iframe) {
        const widget = (window as any).SC.Widget(iframe);
        if (newPlayState) {
          widget.play();
        } else {
          widget.pause();
        }
      }
    } catch (err) {
      console.error("Error controlling SoundCloud player:", err);
    }
  };

  // Toggle mute state
  const toggleMute = () => {
    setIsMuted(!isMuted);
    try {
      const iframe = audioRef.current;
      if (iframe) {
        const widget = (window as any).SC.Widget(iframe);
        if (!isMuted) {
          widget.setVolume(0);
        } else {
          widget.setVolume(volume * 100);
        }
      }
    } catch (err) {
      console.error("Error controlling SoundCloud volume:", err);
    }
  };

  // Update volume when it changes
  useEffect(() => {
    if (!isMuted) {
      try {
        const iframe = audioRef.current;
        if (iframe) {
          const widget = (window as any).SC.Widget(iframe);
          widget.setVolume(volume * 100);
        }
      } catch (err) {
        console.error("Error setting SoundCloud volume:", err);
      }
    }
  }, [volume, isMuted]);

  if (isMinimized) {
    return (
      <div 
        className="fixed bottom-6 right-6 z-50 transition-all duration-300 transform hover:scale-110"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={() => setIsMinimized(false)}
          className="relative w-12 h-12 bg-black/30 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/10 shadow-lg"
        >
          {isHovered && (
            <div className="absolute -top-8 whitespace-nowrap bg-black/50 backdrop-blur-md px-2 py-1 rounded text-xs">
              {isPlaying ? 'Playing' : 'Paused'} • Click to expand
            </div>
          )}
          
          {/* Glow effect behind the button when hovered */}
          <div className={`absolute inset-0 rounded-full ${isHovered ? 'bg-purple-500/20' : ''} blur-md -z-10 transition-all duration-300`}></div>
          
          {isPlaying ? (
            <Disc className="h-6 w-6 text-white animate-spin" style={{ animationDuration: '3s' }} />
          ) : (
            <Play className="h-5 w-5 text-white" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed ${isMinimized ? 'bottom-6 right-6 w-12 h-12' : 'top-16 left-1/2 -translate-x-1/2 w-[320px]'} z-50 transition-all duration-300`}>
      <div className="neo-blur rounded-lg overflow-hidden border border-white/10 shadow-2xl">
        <div className="p-2 flex items-center justify-between bg-black/40">
          <div className="flex items-center space-x-2">
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center hover:bg-purple-500/50 transition-colors"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-white" />
              ) : (
                <Play className="h-4 w-4 text-white" />
              )}
            </button>
            
            <button
              onClick={toggleMute}
              className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-white" />
              ) : (
                <Volume2 className="h-4 w-4 text-white" />
              )}
            </button>
          </div>
          
          <div className="text-xs text-white/80 font-medium tracking-wider">
            JESTFLY PLAYER
          </div>
          
          <button
            onClick={() => setIsMinimized(true)}
            className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
        
        <div className="h-[166px] bg-black/10">
          <iframe
            ref={audioRef}
            title="SoundCloud Player"
            width="100%" 
            height="166" 
            scrolling="no" 
            frameBorder="no" 
            allow="autoplay"
            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1608339566&color=%238B5CF6&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default SoundCloudPlayer;
