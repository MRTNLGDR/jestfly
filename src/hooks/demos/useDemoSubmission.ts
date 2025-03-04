
import { useState } from 'react';
import { submitDemo, DemoSubmission } from '../../services/demoService';

export interface DemoFormData {
  artistName: string;
  email: string;
  genre: string;
  biography: string;
  socialLinks: string;
  file: File | null;
}

export const useDemoSubmission = () => {
  const [formData, setFormData] = useState<DemoFormData>({
    artistName: '',
    email: '',
    genre: '',
    biography: '',
    socialLinks: '',
    file: null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: string; message: string }>({
    type: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const resetForm = () => {
    setFormData({
      artistName: '',
      email: '',
      genre: '',
      biography: '',
      socialLinks: '',
      file: null,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.file) {
      setFeedback({
        type: 'error',
        message: 'Por favor, faça upload de um arquivo de demo',
      });
      return;
    }
    
    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });
    
    try {
      // Transformar dados do formulário para o formato esperado pela API
      const submissionData: Omit<DemoSubmission, 'file_path'> = {
        artist_name: formData.artistName,
        email: formData.email,
        genre: formData.genre || null,
        biography: formData.biography || null,
        social_links: formData.socialLinks || null,
      };

      const result = await submitDemo(submissionData, formData.file);
      
      if (result.success) {
        setFeedback({
          type: 'success',
          message: 'Demo enviado com sucesso! Estamos ansiosos para recebê-lo na família JESTFLY Mansion. Nossa equipe irá analisar seu demo e entraremos em contato em breve.',
        });
        resetForm();
      } else {
        setFeedback({
          type: 'error',
          message: result.error || 'Falha ao enviar demo. Por favor, tente novamente mais tarde.',
        });
      }
    } catch (error) {
      console.error('Erro ao enviar demo:', error);
      setFeedback({
        type: 'error',
        message: 'Falha ao enviar demo. Por favor, tente novamente mais tarde.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    feedback,
    handleInputChange,
    handleFileChange,
    handleSubmit,
    resetForm,
  };
};
