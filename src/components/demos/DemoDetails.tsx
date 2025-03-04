
import React from 'react';
import { FileAudio } from 'lucide-react';
import DemoAudioPlayer from './DemoAudioPlayer';

interface Demo {
  id: string;
  artist_name: string;
  email: string;
  genre: string | null;
  biography: string | null;
  social_links: string | null;
  created_at: string;
  status: string;
}

interface DemoDetailsProps {
  demo: Demo;
  audioUrl: string | null;
}

const DemoDetails: React.FC<DemoDetailsProps> = ({ demo, audioUrl }) => {
  return (
    <>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">{demo.artist_name}</h2>
          <p className="text-gray-400">{demo.email}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <FileAudio className="mr-2 h-5 w-5 text-purple-400" />
          <h3 className="text-lg font-semibold">Demo</h3>
        </div>
        
        <div className="py-4">
          {audioUrl ? (
            <DemoAudioPlayer
              trackUrl={audioUrl}
              trackName={demo.artist_name}
            />
          ) : (
            <div className="py-4 text-center text-gray-500">
              Erro ao carregar o áudio
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Detalhes</h3>
        <div className="grid grid-cols-1 gap-4 bg-black/20 p-4 rounded-lg">
          <div>
            <h4 className="text-sm text-gray-400">Gênero</h4>
            <p>{demo.genre || 'Não informado'}</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-400">Biografia</h4>
            <p className="whitespace-pre-line">{demo.biography || 'Não informado'}</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-400">Links Sociais</h4>
            <p>{demo.social_links || 'Não informado'}</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-400">Data de Submissão</h4>
            <p>{new Date(demo.created_at).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DemoDetails;
