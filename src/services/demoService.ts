
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

export interface DemoSubmission {
  artist_name: string;
  email: string;
  genre: string | null;
  biography: string | null;
  social_links: string | null;
  file_path: string;
}

/**
 * Envia uma nova submissão de demo
 */
export const submitDemo = async (
  formData: Omit<DemoSubmission, 'file_path'>,
  file: File
): Promise<{ success: boolean; error?: string; data?: any }> => {
  try {
    // 1. Fazer upload do arquivo para o storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${formData.artist_name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${fileExt}`;
    
    const { data: fileData, error: fileError } = await supabase.storage
      .from('demos')
      .upload(fileName, file);
      
    if (fileError) {
      console.error('Erro ao fazer upload do arquivo:', fileError);
      toast.error('Erro ao fazer upload do arquivo. Por favor, tente novamente.');
      return { success: false, error: fileError.message };
    }
    
    // 2. Salvar os detalhes da submissão no banco de dados
    const { data, error: submissionError } = await supabase
      .from('demo_submissions')
      .insert({
        artist_name: formData.artist_name,
        email: formData.email,
        genre: formData.genre,
        biography: formData.biography,
        social_links: formData.social_links,
        file_path: fileData?.path || fileName,
        status: 'pending',
      })
      .select()
      .single();
      
    if (submissionError) {
      console.error('Erro ao salvar submissão:', submissionError);
      toast.error('Erro ao enviar sua submissão. Por favor, tente novamente.');
      return { success: false, error: submissionError.message };
    }
    
    toast.success('Demo enviado com sucesso! Nossa equipe irá analisar sua submissão.');
    return { success: true, data };
  } catch (error: any) {
    console.error('Erro ao enviar demo:', error);
    toast.error('Ocorreu um erro ao processar sua submissão.');
    return { success: false, error: error.message };
  }
};

/**
 * Recupera todas as submissões de demo (somente para admins)
 */
export const getAllDemoSubmissions = async () => {
  try {
    const { data, error } = await supabase
      .from('demo_submissions')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Erro ao buscar submissões:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Recupera as submissões de demo do usuário atual
 */
export const getUserDemoSubmissions = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from('demo_submissions')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Erro ao buscar submissões do usuário:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Atualiza o status de uma submissão (apenas admins)
 */
export const updateDemoStatus = async (id: string, status: string, reviewerNotes?: string) => {
  try {
    const { data, error } = await supabase
      .from('demo_submissions')
      .update({
        status,
        reviewer_notes: reviewerNotes,
        reviewed_at: new Date().toISOString(),
        reviewed_by: (await supabase.auth.getUser()).data.user?.id
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    toast.success(`Status da submissão atualizado para: ${status}`);
    return { success: true, data };
  } catch (error: any) {
    console.error('Erro ao atualizar status:', error);
    toast.error('Erro ao atualizar status da submissão.');
    return { success: false, error: error.message };
  }
};
