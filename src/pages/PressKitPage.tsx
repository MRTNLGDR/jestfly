
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../components/ui/tooltip';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent } from '../components/ui/card';
import Footer from '../components/Footer';
import { Download, File, Info, Newspaper } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

const PressKitPage: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showKitContent, setShowKitContent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    outlet: '',
    role: 'journalist' as 'journalist' | 'blogger' | 'editor' | 'podcaster' | 'other',
  });
  const [feedback, setFeedback] = useState({
    type: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      role: value as 'journalist' | 'blogger' | 'editor' | 'podcaster' | 'other' 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });
    
    try {
      // Save the press contact to the database
      const { error } = await supabase
        .from('press_contacts')
        .insert({
          name: formData.name,
          email: formData.email,
          outlet: formData.outlet,
          role: formData.role,
          date_requested: new Date().toISOString(),
          verified: false
        } as any); // Using 'as any' to bypass TypeScript checking until types are generated
        
      if (error) throw error;
      
      // Success feedback
      setFeedback({
        type: 'success',
        message: 'Access granted! You can now download press materials.',
      });
      
      setShowKitContent(true);
      
    } catch (error) {
      console.error('Error submitting press contact:', error);
      setFeedback({
        type: 'error',
        message: 'Failed to submit request. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const pressKitItems = [
    { name: 'JESTFLY Logo Pack', size: '10.2 MB', format: 'ZIP', description: 'High-resolution logos in various formats (PNG, SVG, AI)' },
    { name: 'Press Photos 2024', size: '25.5 MB', format: 'ZIP', description: 'Professional photoshoot images in high resolution' },
    { name: 'Artist Biography', size: '0.5 MB', format: 'PDF', description: 'Detailed artist biography and background' },
    { name: 'Technical Rider', size: '1.2 MB', format: 'PDF', description: 'Technical requirements for live performances' },
    { name: 'Press Releases', size: '3.8 MB', format: 'ZIP', description: 'All press releases from the last 12 months' },
    { name: 'Discography', size: '0.8 MB', format: 'PDF', description: 'Complete list of releases with streaming links' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900 text-white">
      <div className="container mx-auto pt-32 px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{t('press.title')}</h1>
            <h2 className="text-xl md:text-2xl text-purple-300 mb-6">{t('press.subtitle')}</h2>
            <p className="text-white/80 max-w-2xl mx-auto">{t('press.description')}</p>
          </div>
          
          {!showKitContent ? (
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-8">
              {feedback.message && (
                <div className={`mb-6 p-4 rounded-lg ${feedback.type === 'success' ? 'bg-green-900/50 border border-green-500' : 'bg-red-900/50 border border-red-500'}`}>
                  {feedback.message}
                </div>
              )}
              
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
                          Your full name
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
                          Your professional email address
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
                          Publication, blog, or media outlet you represent
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
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="role" className="text-white">Your Role</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 ml-2 opacity-70 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-black/90 border border-purple-500 text-white">
                          Select the role that best describes you
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select onValueChange={handleRoleChange} defaultValue={formData.role}>
                    <SelectTrigger className="bg-black/50 border-white/20 text-white">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border border-purple-500 text-white">
                      <SelectItem value="journalist">Journalist</SelectItem>
                      <SelectItem value="blogger">Blogger</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="podcaster">Podcaster</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
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
                        <Newspaper className="h-5 w-5 mr-2" />
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
                <h2 className="text-2xl font-bold mb-6">Press Kit Materials</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pressKitItems.map((item, idx) => (
                    <Card key={idx} className="bg-black/50 border border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="h-12 w-12 bg-purple-900/50 rounded-lg flex items-center justify-center">
                            <File className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-white/60 mb-1">{item.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-white/50">{item.size} • {item.format}</span>
                              <Button variant="ghost" size="sm" className="hover:bg-purple-900/50">
                                <Download className="h-4 w-4 mr-1" /> Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Press Inquiries</h3>
                    <p className="text-white/70">press@jestfly.com</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Booking</h3>
                    <p className="text-white/70">bookings@jestfly.com</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Management</h3>
                    <p className="text-white/70">management@jestfly.com</p>
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
