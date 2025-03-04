
import React from 'react';
import GlassAudioPlayer from '../GlassAudioPlayer';

interface DemoAudioPlayerProps {
  trackUrl: string;
  trackName: string;
}

const DemoAudioPlayer: React.FC<DemoAudioPlayerProps> = ({ trackUrl, trackName }) => {
  return (
    <GlassAudioPlayer
      trackUrl={trackUrl}
      trackName={trackName}
      trackAuthor="Demo Submission"
    />
  );
};

export default DemoAudioPlayer;
