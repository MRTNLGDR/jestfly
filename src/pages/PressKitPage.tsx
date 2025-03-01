
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../components/ui/tooltip';
import Footer from '../components/Footer';
import { Download, FileText, Image, Music, Newspaper, Calendar, Info } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

interface PressResource {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'bio' | 'release' | 'calendar' | 'logos';
  downloadUrl: string;
  fileSize: string;
  fileType: string;
}

const MOCK_RESOURCES: PressResource[] = [
  {
    id: '1',
    title: 'Press Photos',
    description: 'High resolution promotional photos for print and web use',
    type: 'image',
    downloadUrl: '#',
    fileSize: '24.5 MB',
    fileType: 'ZIP Archive',
  },
  {
    id: '2',
    title: 'Biography',
    description: 'Artist biography in multiple formats and lengths',
    type: 'bio',
    downloadUrl: '#',
    fileSize: '256 KB',
    fileType: 'PDF',
  },
  {
    id: '3',
    title: 'Press Release Templates',
    description: 'Templates for new releases and events',
    type: 'release',
    downloadUrl: '#',
    fileSize: '1.2 MB',
    fileType: 'DOCX, PDF',
  },
  {
    id: '4',
    title: 'Tour Dates & Events',
    description: 'Upcoming shows, events, and appearances',
    type: 'calendar',
    downloadUrl: '#',
    fileSize: '512 KB',
    fileType: 'PDF, iCal',
  },
  {
    id: '5',
    title: 'Brand Assets & Logos',
    description: 'Logos, color palettes, and brand guidelines',
    type: 'logos',
    downloadUrl: '#',
    fileSize: '8.7 MB',
    fileType: 'ZIP Archive',
  },
];

const PressKitPage: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    outlet: '',
  });
  const [resources] = useState<PressResource[]>(MOCK_RESOURCES);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Store press contact in Supabase
      await supabase
        .from('press_contacts')
        .insert({
          name: formData.name,
          email: formData.email,
          outlet: formData.outlet,
          date_requested: new Date().toISOString(),
        });
      
      // Grant access after successful submission
      setHasAccess(true);
    } catch (error) {
      console.error('Error submitting press access:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-8 w-8 text-purple-400" />;
      case 'bio':
        return <FileText className="h-8 w-8 text-blue-400" />;
      case 'release':
        return <Newspaper className="h-8 w-8 text-green-400" />;
      case 'calendar':
        return <Calendar className="h-8 w-8 text-yellow-400" />;
      case 'logos':
        return <Music className="h-8 w-8 text-pink-400" />;
      default:
        return <FileText className="h-8 w-8 text-gray-400" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900 text-white">
      <div className="container mx-auto pt-32 px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{t('press.title')}</h1>
            <h2 className="text-xl md:text-2xl text-purple-300 mb-6">{t('press.subtitle')}</h2>
            <p className="text-white/80 max-w-2xl mx-auto">{t('press.description')}</p>
          </div>
          
          {!hasAccess ? (
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="name" className="text-white">{t('press.form.name')}</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 ml-2 opacity-70 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-black/90 border border-purple-500 text-white">
                          Your full name as it appears in your publications
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-black/50 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="email" className="text-white">{t('press.form.email')}</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 ml-2 opacity-70 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-black/90 border border-purple-500 text-white">
                          Preferably your professional email address
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
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="outlet" className="text-white">{t('press.form.outlet')}</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 ml-2 opacity-70 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-black/90 border border-purple-500 text-white">
                          The name of your publication, blog, or media outlet
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="outlet"
                    name="outlet"
                    value={formData.outlet}
                    onChange={handleInputChange}
                    required
                    className="bg-black/50 border-white/20 text-white placeholder:text-white/40"
                  />
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
                        {t('press.form.submit')}
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Press Resources</h2>
                  <div className="bg-purple-900/60 text-purple-200 px-3 py-1 rounded-full text-sm">
                    Access Granted
                  </div>
                </div>
                
                <div className="space-y-6">
                  {resources.map((resource) => (
                    <div key={resource.id} className="flex items-start gap-6 p-4 bg-black/30 rounded-lg hover:bg-black/40 transition-colors">
                      <div className="p-4 rounded-lg bg-black/50">
                        {getResourceIcon(resource.type)}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-medium mb-1">{resource.title}</h3>
                        <p className="text-white/70 mb-3">{resource.description}</p>
                        <div className="flex items-center text-sm text-white/50">
                          <span className="mr-4">{resource.fileType}</span>
                          <span>{resource.fileSize}</span>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="border-purple-500 hover:bg-purple-900/30">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Press Contacts</h2>
                
                <div className="space-y-6">
                  <div className="p-4 bg-black/30 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Media Inquiries</h3>
                    <p className="text-white/70 mb-1">For interview requests and press inquiries:</p>
                    <a href="mailto:press@jestfly.com" className="text-purple-400 hover:text-purple-300">press@jestfly.com</a>
                  </div>
                  
                  <div className="p-4 bg-black/30 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Booking & Management</h3>
                    <p className="text-white/70 mb-1">For booking inquiries and management contact:</p>
                    <a href="mailto:bookings@jestfly.com" className="text-purple-400 hover:text-purple-300">bookings@jestfly.com</a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PressKitPage;
