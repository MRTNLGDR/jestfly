
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllDemoSubmissions, updateDemoStatus } from '../../services/demoService';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { FileAudio, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';
import GlassAudioPlayer from '../GlassAudioPlayer';

const AdminDemoReview: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const { data: submissions, isLoading, error, refetch } = useQuery({
    queryKey: ['demoSubmissions'],
    queryFn: getAllDemoSubmissions,
  });

  useEffect(() => {
    if (selectedDemo) {
      setReviewNotes(selectedDemo.reviewer_notes || '');
      getAudioUrl(selectedDemo.file_path);
    } else {
      setAudioUrl(null);
    }
  }, [selectedDemo]);

  const getAudioUrl = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('demos')
        .createSignedUrl(filePath, 60 * 60); // URL válida por 1 hora
        
      if (error) throw error;
      setAudioUrl(data?.signedUrl || null);
    } catch (error) {
      console.error('Erro ao obter URL do áudio:', error);
      setAudioUrl(null);
    }
  };

  const handleApprove = async () => {
    if (!selectedDemo) return;
    
    const result = await updateDemoStatus(selectedDemo.id, 'approved', reviewNotes);
    if (result.success) {
      refetch();
      setSelectedDemo(null);
    }
  };

  const handleReject = async () => {
    if (!selectedDemo) return;
    
    const result = await updateDemoStatus(selectedDemo.id, 'rejected', reviewNotes);
    if (result.success) {
      refetch();
      setSelectedDemo(null);
    }
  };

  if (isLoading) return <div className="text-center py-10">Carregando submissões...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Erro ao carregar submissões</div>;

  const data = submissions?.data || [];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-black/30 rounded-lg border border-white/10 p-4 h-[calc(100vh-200px)] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Submissões de Demo</h3>
        
        {data.length === 0 ? (
          <p className="text-center py-10 text-gray-400">Nenhuma submissão encontrada</p>
        ) : (
          <div className="space-y-3">
            {data.map((demo: any) => (
              <div 
                key={demo.id}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedDemo?.id === demo.id 
                    ? 'bg-purple-900/30 border border-purple-500/50' 
                    : 'bg-gray-900/50 border border-white/5 hover:bg-gray-800/50'
                }`}
                onClick={() => setSelectedDemo(demo)}
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
            ))}
          </div>
        )}
      </div>
      
      <div className="lg:col-span-2">
        {selectedDemo ? (
          <div className="bg-black/30 rounded-lg border border-white/10 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{selectedDemo.artist_name}</h2>
                <p className="text-gray-400">{selectedDemo.email}</p>
              </div>
              <Badge className={
                selectedDemo.status === 'pending' ? 'bg-yellow-600' : 
                selectedDemo.status === 'approved' ? 'bg-green-600' : 'bg-red-600'
              }>
                {selectedDemo.status === 'pending' ? 'Pendente' : 
                 selectedDemo.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
              </Badge>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <FileAudio className="mr-2 h-5 w-5 text-purple-400" />
                <h3 className="text-lg font-semibold">Demo</h3>
              </div>
              
              {audioUrl ? (
                <div className="py-4">
                  <GlassAudioPlayer
                    trackUrl={audioUrl}
                    trackName={selectedDemo.artist_name}
                    trackAuthor="Demo Submission"
                  />
                </div>
              ) : (
                <div className="py-4 text-center text-gray-500">
                  Erro ao carregar o áudio
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Detalhes</h3>
              <div className="grid grid-cols-1 gap-4 bg-black/20 p-4 rounded-lg">
                <div>
                  <h4 className="text-sm text-gray-400">Gênero</h4>
                  <p>{selectedDemo.genre || 'Não informado'}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400">Biografia</h4>
                  <p className="whitespace-pre-line">{selectedDemo.biography || 'Não informado'}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400">Links Sociais</h4>
                  <p>{selectedDemo.social_links || 'Não informado'}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400">Data de Submissão</h4>
                  <p>{new Date(selectedDemo.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Feedback do Revisor</h3>
              <Textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Adicione notas ou feedback para o artista"
                className="h-24 bg-black/20 border-white/10"
              />
            </div>
            
            <div className="flex space-x-4">
              <Button
                onClick={handleApprove}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={selectedDemo.status === 'approved'}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Aprovar
              </Button>
              <Button
                onClick={handleReject}
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={selectedDemo.status === 'rejected'}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Rejeitar
              </Button>
              <Button
                onClick={() => {
                  setSelectedDemo(null);
                  setReviewNotes('');
                }}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-black/30 rounded-lg border border-white/10 p-6">
            <div className="text-center">
              <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-200 mb-2">Selecione uma submissão</h3>
              <p className="text-gray-400">Escolha uma submissão de demo na lista para revisar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDemoReview;
