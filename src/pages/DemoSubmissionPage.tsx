
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../components/ui/tooltip';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { Badge } from '../components/ui/badge';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import { Headphones, Info, Mic, Star, Heart, Users, DollarSign, MusicIcon, Upload, Calendar } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

const DemoSubmissionPage: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMansionDetails, setShowMansionDetails] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
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

  useEffect(() => {
    // Auto-rotate slides
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const mansionFeatures = [
    { icon: <Mic className="w-6 h-6 text-purple-300" />, title: "Live Sessions", description: "Perform live in our state-of-the-art studio to a global audience" },
    { icon: <Star className="w-6 h-6 text-yellow-400" />, title: "Opportunities", description: "Get discovered by major labels and industry professionals" },
    { icon: <Heart className="w-6 h-6 text-red-400" />, title: "Artist Support", description: "Access mentorship, production assistance, and creative direction" },
    { icon: <Users className="w-6 h-6 text-blue-400" />, title: "Networking", description: "Connect with other artists, producers, and industry insiders" },
    { icon: <DollarSign className="w-6 h-6 text-green-400" />, title: "Royalties", description: "Earn fair royalties from your music with transparent payments" },
    { icon: <Headphones className="w-6 h-6 text-purple-400" />, title: "Professional Studio", description: "Record in our premium acoustically designed studios" }
  ];

  const testimonials = [
    { name: "DJ Cosmic", quote: "Joining the JESTFLY Mansion changed my career trajectory completely. The connections I made here opened doors I didn't even know existed.", image: "/placeholder.svg" },
    { name: "Luna Echo", quote: "The support system at JESTFLY is unmatched. From production guidance to marketing strategy, they've helped me grow as an artist.", image: "/placeholder.svg" },
    { name: "Beat Master K", quote: "The royalty structure is truly artist-first. For the first time, I feel like my work is being valued appropriately.", image: "/placeholder.svg" }
  ];

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
      
      // Then, save the submission details to the database
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
        } as any);
        
      if (submissionError) throw submissionError;
      
      // Success feedback
      setFeedback({
        type: 'success',
        message: 'Demo submitted successfully! We can\'t wait to welcome you to the JESTFLY Mansion family. Our team will review your demo and get back to you soon.',
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

  const slideImages = [
    "/public/placeholder.svg",
    "/public/placeholder.svg",
    "/public/placeholder.svg",
    "/public/placeholder.svg"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#1A1F2C] to-purple-900 text-white">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        {/* Background with parallax effect */}
        <div className="absolute inset-0 bg-black opacity-70 z-10"></div>
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            {slideImages.map((img, index) => (
              <motion.div 
                key={index}
                className="absolute inset-0 w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: currentSlide === index ? 1 : 0,
                  scale: currentSlide === index ? 1.05 : 1
                }}
                transition={{ duration: 1.5 }}
              >
                <img 
                  src={img} 
                  alt="JESTFLY Mansion" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-6 h-full flex flex-col items-center justify-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-6 py-2 px-4 bg-purple-700 text-white">Exclusive Opportunity</Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">Join The JESTFLY Mansion</h1>
            <p className="text-xl md:text-2xl text-purple-200 mb-8">Where artist dreams become reality. Submit your demo and step into a world of unlimited opportunities.</p>
            
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              {mansionFeatures.slice(0, 3).map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                  className="flex items-center space-x-2"
                >
                  <div className="p-2 rounded-full bg-white/10">{feature.icon}</div>
                  <span>{feature.title}</span>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6"
                onClick={() => {
                  const demoForm = document.getElementById('demo-form');
                  if (demoForm) demoForm.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <MusicIcon className="mr-2 h-5 w-5" />
                Submit Your Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-8 h-12 rounded-full border-2 border-white/50 flex justify-center">
            <motion.div 
              className="w-1.5 h-3 bg-white rounded-full mt-2"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
      
      {/* Mansion Experience Section */}
      <div className="py-24 bg-gradient-to-b from-[#1A1F2C] to-purple-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 py-1.5 px-3 bg-purple-700/50 text-white">THE JESTFLY EXPERIENCE</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">The Ultimate Artist Mansion</h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">More than just a label - a complete ecosystem designed to nurture artists and propel careers to unprecedented heights.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mansionFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-8 hover:bg-black/50 transition-all duration-300"
              >
                <div className="p-3 bg-purple-900/30 rounded-lg inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/80">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <Button
              variant="outline"
              className="border-purple-500 text-purple-300 hover:bg-purple-900/30"
              onClick={() => setShowMansionDetails(!showMansionDetails)}
            >
              {showMansionDetails ? "Show Less" : "Learn More About The Mansion"}
            </Button>
            
            {showMansionDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-12 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">The Mansion Facilities</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="p-1 bg-purple-900/30 rounded-full mr-3 mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span>State-of-the-art recording studios equipped with premium gear</span>
                      </li>
                      <li className="flex items-start">
                        <div className="p-1 bg-purple-900/30 rounded-full mr-3 mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span>Professional-grade live streaming setup for global reach</span>
                      </li>
                      <li className="flex items-start">
                        <div className="p-1 bg-purple-900/30 rounded-full mr-3 mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span>Collaborative spaces for networking and creative sessions</span>
                      </li>
                      <li className="flex items-start">
                        <div className="p-1 bg-purple-900/30 rounded-full mr-3 mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span>Resident producer suites for ongoing project development</span>
                      </li>
                      <li className="flex items-start">
                        <div className="p-1 bg-purple-900/30 rounded-full mr-3 mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span>Artist lounges and relaxation areas to foster creativity</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Our Artist Support</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="p-1 bg-purple-900/30 rounded-full mr-3 mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span>Dedicated A&R team to guide your career progression</span>
                      </li>
                      <li className="flex items-start">
                        <div className="p-1 bg-purple-900/30 rounded-full mr-3 mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span>Marketing specialists to build your brand and audience</span>
                      </li>
                      <li className="flex items-start">
                        <div className="p-1 bg-purple-900/30 rounded-full mr-3 mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span>Digital distribution to all major platforms with detailed analytics</span>
                      </li>
                      <li className="flex items-start">
                        <div className="p-1 bg-purple-900/30 rounded-full mr-3 mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span>Legal and rights management to protect your intellectual property</span>
                      </li>
                      <li className="flex items-start">
                        <div className="p-1 bg-purple-900/30 rounded-full mr-3 mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span>Industry mentorship from established artists and executives</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-24 bg-gradient-to-b from-purple-900/50 to-black/70">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 py-1.5 px-3 bg-purple-700/50 text-white">SUCCESS STORIES</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Hear From Our Artists</h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">Artists who've joined the JESTFLY family share their transformative experiences.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-8 hover:bg-black/50 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{testimonial.name}</h3>
                    <p className="text-purple-300">JESTFLY Artist</p>
                  </div>
                </div>
                <p className="text-white/80 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Demo Submission Form */}
      <div id="demo-form" className="py-24 bg-gradient-to-b from-black/70 to-[#1A1F2C]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 py-1.5 px-3 bg-purple-700/50 text-white">YOUR OPPORTUNITY</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Submit Your Demo</h2>
              <p className="text-xl text-purple-200 max-w-3xl mx-auto">Take the first step towards joining the JESTFLY Mansion. Our A&R team reviews every submission with care.</p>
            </div>
            
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
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-6"
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
                      <span className="flex items-center text-lg">
                        <MusicIcon className="h-5 w-5 mr-2" />
                        {t('demo.form.submit')}
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Calendar Section */}
      <div className="py-16 bg-[#1A1F2C]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Calendar className="h-8 w-8 text-purple-400 mr-3" />
              <h2 className="text-3xl font-bold">Upcoming JESTFLY Events</h2>
            </div>
            <p className="text-xl text-purple-200 mb-12">Join us at these exclusive events and experience the JESTFLY Mansion vibe</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6 hover:bg-black/50 transition-all duration-300">
                <div className="text-purple-300 text-lg font-semibold mb-2">July 15, 2023</div>
                <h3 className="text-2xl font-bold mb-3">Producer Showcase Night</h3>
                <p className="text-white/80 mb-4">An evening featuring our top producers showcasing their latest beats and production techniques.</p>
                <Badge className="bg-purple-900/50 text-white">Los Angeles, CA</Badge>
              </div>
              
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6 hover:bg-black/50 transition-all duration-300">
                <div className="text-purple-300 text-lg font-semibold mb-2">August 22, 2023</div>
                <h3 className="text-2xl font-bold mb-3">JESTFLY Summer Festival</h3>
                <p className="text-white/80 mb-4">Our annual summer gathering featuring live performances from JESTFLY artists and special guests.</p>
                <Badge className="bg-purple-900/50 text-white">Miami, FL</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-24 bg-gradient-to-b from-[#1A1F2C] to-black relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[50vw] h-[50vh] rounded-full bg-[#8B5CF6]/10 blur-[100px] animate-float"></div>
          <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] rounded-full bg-[#4ade80]/10 blur-[100px] animate-float" style={{ animationDelay: '-5s' }}></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to Transform Your Career?</h2>
            <p className="text-xl text-purple-200 mb-12 max-w-3xl mx-auto">Join the exclusive community of artists who've found their home at the JESTFLY Mansion. Submit your demo today and take the first step.</p>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6"
              onClick={() => {
                const demoForm = document.getElementById('demo-form');
                if (demoForm) demoForm.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Star className="mr-2 h-5 w-5" />
              Start Your JESTFLY Journey
            </Button>
          </div>
        </div>
      </div>
      
      {/* Info Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button className="fixed bottom-8 right-8 bg-purple-600 hover:bg-purple-700 rounded-full h-14 w-14 flex items-center justify-center">
            <Info className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-black/90 border-l border-purple-500/50 text-white">
          <SheetHeader>
            <SheetTitle className="text-white text-xl">About JESTFLY Mansion</SheetTitle>
            <SheetDescription className="text-white/70">
              The ultimate artist community and creative space
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <p>The JESTFLY Mansion is more than a record label - it's a movement designed to elevate artists to their full potential in today's digital music landscape.</p>
            <p>What sets us apart:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Artist-first approach with fair royalty splits</li>
              <li>Global network of industry connections</li>
              <li>Regular live streaming opportunities</li>
              <li>Access to professional production resources</li>
              <li>Marketing and brand development</li>
              <li>Collaborative community of like-minded artists</li>
            </ul>
            <div className="pt-4">
              <h3 className="font-bold mb-2">Contact Information</h3>
              <p>Email: contact@jestflymansion.com</p>
              <p>Phone: (555) 123-4567</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      <Footer />
    </div>
  );
};

export default DemoSubmissionPage;
