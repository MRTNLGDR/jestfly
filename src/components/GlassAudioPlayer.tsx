
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Disc, Music } from 'lucide-react';

interface GlassAudioPlayerProps {
  isMinimized: boolean;
  setIsMinimized: (value: boolean) => void;
}

const GlassAudioPlayer: React.FC<GlassAudioPlayerProps> = ({ 
  isMinimized, 
  setIsMinimized 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const targetVolume = 0.7; // Target volume level
  
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
      // Cleanup intervals on component unmount
      if (fadeIntervalRef.current) {
        window.clearInterval(fadeIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle playing and pausing
  const togglePlay = () => {
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);
    
    // Interact with audio element
    try {
      const audio = audioRef.current;
      if (audio) {
        if (newPlayState) {
          audio.play().catch(err => console.error("Error playing audio:", err));
        } else {
          audio.pause();
        }
      }
    } catch (err) {
      console.error("Error controlling audio player:", err);
    }
  };

  // Circle player (minimized state)
  if (isMinimized) {
    return (
      <div 
        className="fixed bottom-8 right-8 animate-[float_4s_ease-in-out_infinite] z-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={togglePlay}
          className="w-14 h-14 backdrop-blur-xl bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white shadow-lg overflow-hidden transition-all duration-300 hover:scale-105"
        >
          {isHovered && (
            <div className="absolute -top-8 whitespace-nowrap bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-xs">
              {isPlaying ? 'Playing' : 'Paused'}
            </div>
          )}
          
          {/* Glow effect behind the button */}
          <div className={`absolute inset-0 rounded-full ${isPlaying ? 'bg-purple-500/20' : ''} blur-md -z-10 transition-all duration-300`}></div>
          
          {isPlaying ? (
            <Pause className="h-5 w-5 text-white" />
          ) : (
            <Play className="h-5 w-5 text-white ml-0.5" />
          )}
        </button>
      </div>
    );
  }

  // Expanded player
  return (
    <div className="fixed bottom-8 right-8 z-50 w-64">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
        <div className="p-4 flex items-center justify-between">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-white" />
            ) : (
              <Play className="h-5 w-5 text-white ml-0.5" />
            )}
          </button>
          
          <div className="text-xs text-white/80 font-medium tracking-wider">
            GLASS MUSIC PLAYER
          </div>
          
          <button
            onClick={() => setIsMinimized(true)}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <Disc className="h-4 w-4 text-white" />
          </button>
        </div>
        
        <div className="px-4 pb-4">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-1/3 rounded-full"></div>
          </div>
          
          {/* Hidden audio element */}
          <audio 
            ref={audioRef}
            src="/assets/sample-track.mp3" 
            loop
          />
          
          <div className="mt-2 text-xs text-white/60 flex justify-between">
            <span>1:23</span>
            <span>3:45</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassAudioPlayer;
