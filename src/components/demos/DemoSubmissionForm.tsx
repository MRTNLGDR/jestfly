
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../ui/tooltip';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Info, Upload, MusicIcon } from 'lucide-react';
import { DemoFormData } from '../../hooks/demos/useDemoSubmission';

interface DemoSubmissionFormProps {
  formData: DemoFormData;
  isSubmitting: boolean;
  feedback: { type: string; message: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const DemoSubmissionForm: React.FC<DemoSubmissionFormProps> = ({
  formData,
  isSubmitting,
  feedback,
  handleInputChange,
  handleFileChange,
  handleSubmit,
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-8">
      {feedback.message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-lg ${feedback.type === 'success' ? 'bg-green-900/50 border border-green-500' : 'bg-red-900/50 border border-red-500'}`}
        >
          {feedback.message}
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="artistName" className="text-white">{t('demo.form.name')}</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-2 opacity-70 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border border-purple-500 text-white">
                    Seu nome artístico ou do grupo
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="artistName"
              name="artistName"
              value={formData.artistName}
              onChange={handleInputChange}
              required
              className="bg-black/50 border-white/20 text-white placeholder:text-white/40"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="email" className="text-white">{t('demo.form.email')}</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-2 opacity-70 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-black/90 border border-purple-500 text-white">
                    Entraremos em contato através deste email
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="bg-black/50 border-white/20 text-white placeholder:text-white/40"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="genre" className="text-white">{t('demo.form.genre')}</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-2 opacity-70 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-black/90 border border-purple-500 text-white">
                  Gênero principal da sua música
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleInputChange}
            className="bg-black/50 border-white/20 text-white placeholder:text-white/40"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="biography" className="text-white">{t('demo.form.bio')}</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-2 opacity-70 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-black/90 border border-purple-500 text-white">
                  Conte sobre você e sua jornada musical
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <textarea
            id="biography"
            name="biography"
            value={formData.biography}
            onChange={handleInputChange}
            rows={4}
            className="w-full bg-black/50 border border-white/20 rounded-md px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="socialLinks" className="text-white">{t('demo.form.links')}</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-2 opacity-70 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-black/90 border border-purple-500 text-white">
                  Adicione links para Spotify, SoundCloud, Instagram, etc.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="socialLinks"
            name="socialLinks"
            value={formData.socialLinks}
            onChange={handleInputChange}
            placeholder="https://soundcloud.com/seu-perfil, https://instagram.com/seu-perfil"
            className="bg-black/50 border-white/20 text-white placeholder:text-white/40"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="demoFile" className="text-white">{t('demo.form.upload')}</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-2 opacity-70 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-black/90 border border-purple-500 text-white">
                  Faça upload de arquivos MP3 ou WAV (máx 50MB)
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              className="border-purple-500 hover:bg-purple-900/30"
              onClick={() => document.getElementById('demoFile')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Selecionar Arquivo
            </Button>
            <span className="text-white/70">
              {formData.file ? formData.file.name : 'Nenhum arquivo selecionado'}
            </span>
            <input
              id="demoFile"
              name="demoFile"
              type="file"
              accept=".mp3,.wav"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
        
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-6"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </span>
            ) : (
              <span className="flex items-center text-lg">
                <MusicIcon className="h-5 w-5 mr-2" />
                {t('demo.form.submit')}
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DemoSubmissionForm;
