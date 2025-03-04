
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllDemoSubmissions, updateDemoStatus } from '../../services/demoService';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import DemoList from './DemoList';
import DemoDetails from './DemoDetails';
import ReviewForm from './ReviewForm';
import EmptyDemoState from './EmptyDemoState';
import { toast } from 'sonner';

interface Demo {
  id: string;
  artist_name: string;
  email: string;
  file_path: string;
  genre: string | null;
  biography: string | null;
  social_links: string | null;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  reviewer_notes: string | null;
  created_at: string;
}

const AdminDemoReview: React.FC = () => {
  const { user } = useAuth();
  const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState('all');
  
  // Buscar submissões de demos
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['demo-submissions'],
    queryFn: getAllDemoSubmissions,
  });

  // Extract demos array from the response
  const demos = data?.success && Array.isArray(data.data) ? data.data : [];
  
  // Quando selecionar uma demo, buscar a URL do áudio
  useEffect(() => {
    const getAudioUrl = async () => {
      if (selectedDemo) {
        try {
          const { data, error } = await supabase.storage
            .from('demos')
            .createSignedUrl(selectedDemo.file_path, 300);
          
          if (error) throw error;
          setAudioUrl(data.signedUrl);
        } catch (error) {
          console.error('Erro ao buscar URL do áudio:', error);
          setAudioUrl(null);
        }
      } else {
        setAudioUrl(null);
      }
    };
    
    getAudioUrl();
  }, [selectedDemo]);
  
  // Inicializar notas de revisão quando selecionar uma demo
  useEffect(() => {
    if (selectedDemo) {
      setReviewNotes(selectedDemo.reviewer_notes || '');
    } else {
      setReviewNotes('');
    }
  }, [selectedDemo]);
  
  // Filtrar demos com base na aba selecionada
  const filteredDemos = demos.filter((demo) => {
    if (tabValue === 'all') return true;
    if (tabValue === 'pending') return demo.status === 'pending';
    if (tabValue === 'approved') return demo.status === 'approved';
    if (tabValue === 'rejected') return demo.status === 'rejected';
    return true;
  });
  
  // Manipuladores para ações de revisão
  const handleApprove = async () => {
    if (!selectedDemo || !user) return;
    
    try {
      await updateDemoStatus(selectedDemo.id, 'approved', reviewNotes);
      toast.success('Demo aprovada com sucesso');
      await refetch();
      // Atualizar a demo selecionada com o novo status
      setSelectedDemo((prev) => prev ? { ...prev, status: 'approved' as const } : null);
    } catch (error) {
      console.error('Erro ao aprovar demo:', error);
      toast.error('Erro ao aprovar demo');
    }
  };
  
  const handleReject = async () => {
    if (!selectedDemo || !user) return;
    
    try {
      await updateDemoStatus(selectedDemo.id, 'rejected', reviewNotes);
      toast.success('Demo rejeitada com sucesso');
      await refetch();
      // Atualizar a demo selecionada com o novo status
      setSelectedDemo((prev) => prev ? { ...prev, status: 'rejected' as const } : null);
    } catch (error) {
      console.error('Erro ao rejeitar demo:', error);
      toast.error('Erro ao rejeitar demo');
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Revisão de Demos</h2>
      
      <Tabs value={tabValue} onValueChange={setTabValue} className="w-full h-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="approved">Aprovadas</TabsTrigger>
          <TabsTrigger value="rejected">Rejeitadas</TabsTrigger>
        </TabsList>
        
        <div className="flex flex-1 gap-6 h-[calc(100%-48px)] overflow-hidden">
          {/* Lista de demos */}
          <div className="w-1/3 overflow-y-auto pr-2">
            <TabsContent value={tabValue} className="mt-0 h-full">
              <DemoList 
                demos={filteredDemos as Demo[]} 
                selectedDemoId={selectedDemo?.id || null}
                onSelectDemo={(demo) => setSelectedDemo(demo as Demo)}
              />
            </TabsContent>
          </div>
          
          <Separator orientation="vertical" />
          
          {/* Detalhes e revisão */}
          <div className="w-2/3 overflow-y-auto pl-2">
            {selectedDemo ? (
              <div className="space-y-6">
                <DemoDetails 
                  demo={selectedDemo}
                  audioUrl={audioUrl}
                />
                
                <Separator />
                
                <ReviewForm
                  reviewNotes={reviewNotes}
                  onNotesChange={setReviewNotes}
                  demoStatus={selectedDemo.status}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onCancel={() => setSelectedDemo(null)}
                />
              </div>
            ) : (
              <EmptyDemoState />
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminDemoReview;
