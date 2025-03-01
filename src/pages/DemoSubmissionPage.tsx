import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../components/ui/tooltip';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import Footer from '../components/Footer';
import { Info, Music, Upload } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

const DemoSubmissionPage: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    artistName: '',
    email: '',
    genre: '',
    biography: '',
    socialLinks: '',
    file: null as File | null,
  });
  const [feedback, setFeedback] = useState({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.file) {
      setFeedback({
        type: 'error',
        message: 'Please upload a demo file',
      });
      return;
    }
    
    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });
    
    try {
      // First, upload the file to Supabase Storage
      const fileExt = formData.file.name.split('.').pop();
      const fileName = `${formData.artistName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${fileExt}`;
      
      const { data: fileData, error: fileError } = await supabase.storage
        .from('demos')
        .upload(fileName, formData.file);
        
      if (fileError) throw fileError;
      
      // Then, save the submission details to the database using a custom Insert type
      // that matches the schema of our demo_submissions table
      const { error: submissionError } = await supabase
        .from('demo_submissions')
        .insert({
          artist_name: formData.artistName,
          email: formData.email,
          genre: formData.genre,
          biography: formData.biography,
          social_links: formData.socialLinks,
          file_path: fileData?.path || fileName,
          status: 'pending',
        } as any); // Using 'as any' to bypass TypeScript checking until types are generated
        
      if (submissionError) throw submissionError;
      
      // Success feedback
      setFeedback({
        type: 'success',
        message: 'Demo submitted successfully! Our team will review it and get back to you soon.',
      });
      
      // Reset form
      setFormData({
        artistName: '',
        email: '',
        genre: '',
        biography: '',
        socialLinks: '',
        file: null,
      });
      
    } catch (error) {
      console.error('Error submitting demo:', error);
      setFeedback({
        type: 'error',
        message: 'Failed to submit demo. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900 text-white">
      <div className="container mx-auto pt-32 px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{t('demo.title')}</h1>
            <h2 className="text-xl md:text-2xl text-purple-300 mb-6">{t('demo.subtitle')}</h2>
            <p className="text-white/80 max-w-2xl mx-auto">{t('demo.description')}</p>
          </div>
          
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-8">
            {feedback.message && (
              <div className={`mb-6 p-4 rounded-lg ${feedback.type === 'success' ? 'bg-green-900/50 border border-green-500' : 'bg-red-900/50 border border-red-500'}`}>
                {feedback.message}
              </div>
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
                          Your artist or group name
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
                          We'll contact you through this email
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
                        Main genre of your music
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  required
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
                        Tell us about yourself and your music journey
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
                  required
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
                        Add links to Spotify, SoundCloud, Instagram, etc.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="socialLinks"
                  name="socialLinks"
                  value={formData.socialLinks}
                  onChange={handleInputChange}
                  placeholder="https://soundcloud.com/your-profile, https://instagram.com/your-profile"
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
                        Upload MP3 or WAV files (max 50MB)
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
                    Select File
                  </Button>
                  <span className="text-white/70">
                    {formData.file ? formData.file.name : 'No file selected'}
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
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Music className="h-5 w-5 mr-2" />
                      {t('demo.form.submit')}
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
          
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">How the Selection Process Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Submit Demo</h3>
                <p className="text-white/70">Upload your best track and complete the submission form</p>
              </div>
              
              <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Review Process</h3>
                <p className="text-white/70">Our A&R team will listen to your track and evaluate it</p>
              </div>
              
              <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-medium mb-2">JESTFLY Partnership</h3>
                <p className="text-white/70">Selected artists join our label and gain access to the JESTFLY Mansion VIP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Sheet>
        <SheetTrigger asChild>
          <Button className="fixed bottom-8 right-8 bg-purple-600 hover:bg-purple-700 rounded-full h-14 w-14 flex items-center justify-center">
            <Info className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-black/90 border-l border-purple-500/50 text-white">
          <SheetHeader>
            <SheetTitle className="text-white text-xl">About JESTFLY Records</SheetTitle>
            <SheetDescription className="text-white/70">
              Our label focuses on discovering and developing electronic music talent
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <p>JESTFLY Records is a cutting-edge electronic music label dedicated to pushing boundaries and discovering the next generation of talent.</p>
            <p>Selected artists will:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Get professional releases on major platforms</li>
              <li>Join the exclusive JESTFLY Mansion VIP community</li>
              <li>Receive marketing and PR support</li>
              <li>Get opportunities for live performances</li>
              <li>Collaborate with established JESTFLY artists</li>
            </ul>
          </div>
        </SheetContent>
      </Sheet>
      
      <Footer />
    </div>
  );
};

export default DemoSubmissionPage;
