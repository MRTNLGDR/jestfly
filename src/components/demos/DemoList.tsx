
import React from 'react';
import { Badge } from '../ui/badge';

interface Demo {
  id: string;
  artist_name: string;
  genre: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface DemoListProps {
  demos: Demo[];
  selectedDemoId: string | null;
  onSelectDemo: (demo: Demo) => void;
}

const DemoList: React.FC<DemoListProps> = ({ demos, selectedDemoId, onSelectDemo }) => {
  return (
    <div className="space-y-3">
      {demos.length === 0 ? (
        <p className="text-center py-10 text-gray-400">Nenhuma submissão encontrada</p>
      ) : (
        demos.map((demo) => (
          <div 
            key={demo.id}
            className={`p-3 rounded-lg cursor-pointer transition-all ${
              selectedDemoId === demo.id 
                ? 'bg-purple-900/30 border border-purple-500/50' 
                : 'bg-gray-900/50 border border-white/5 hover:bg-gray-800/50'
            }`}
            onClick={() => onSelectDemo(demo)}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{demo.artist_name}</h4>
              <Badge className={
                demo.status === 'pending' ? 'bg-yellow-600' : 
                demo.status === 'approved' ? 'bg-green-600' : 'bg-red-600'
              }>
                {demo.status === 'pending' ? 'Pendente' : 
                demo.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
              </Badge>
            </div>
            <p className="text-sm text-gray-400 mt-1">{demo.genre || 'Sem gênero'}</p>
            <div className="text-xs text-gray-500 mt-2">
              {new Date(demo.created_at).toLocaleDateString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DemoList;
