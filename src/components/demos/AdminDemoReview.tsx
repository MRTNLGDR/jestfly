
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllDemoSubmissions, updateDemoStatus } from '../../services/demoService';
import { Badge } from '../ui/badge';
import { supabase } from '../../integrations/supabase/client';
import { GlassCard } from '../ui/glass-card';
import Loading from '../ui/loading';
import DemoList from './DemoList';
import DemoDetails from './DemoDetails';
import ReviewForm from './ReviewForm';
import EmptyDemoState from './EmptyDemoState';

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

  if (isLoading) return <Loading text="Carregando submissões..." />;
  if (error) return <div className="text-center py-10 text-red-500">Erro ao carregar submissões</div>;

  const data = submissions?.data || [];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-black/30 rounded-lg border border-white/10 p-4 h-[calc(100vh-200px)] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Submissões de Demo</h3>
        <DemoList 
          demos={data} 
          selectedDemoId={selectedDemo?.id || null}
          onSelectDemo={setSelectedDemo}
        />
      </div>
      
      <div className="lg:col-span-2">
        {selectedDemo ? (
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div />
              <Badge className={
                selectedDemo.status === 'pending' ? 'bg-yellow-600' : 
                selectedDemo.status === 'approved' ? 'bg-green-600' : 'bg-red-600'
              }>
                {selectedDemo.status === 'pending' ? 'Pendente' : 
                selectedDemo.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
              </Badge>
            </div>
            
            <DemoDetails demo={selectedDemo} audioUrl={audioUrl} />
            
            <ReviewForm 
              reviewNotes={reviewNotes}
              onNotesChange={setReviewNotes}
              demoStatus={selectedDemo.status}
              onApprove={handleApprove}
              onReject={handleReject}
              onCancel={() => {
                setSelectedDemo(null);
                setReviewNotes('');
              }}
            />
          </GlassCard>
        ) : (
          <EmptyDemoState />
        )}
      </div>
    </div>
  );
};

export default AdminDemoReview;
