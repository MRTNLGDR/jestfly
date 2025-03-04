
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../components/ui/tooltip';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import { Headphones, Info, Mic, Star, Heart, Users, DollarSign, MusicIcon, Upload, Calendar } from 'lucide-react';
import DemoSubmissionForm from '../components/demos/DemoSubmissionForm';
import { useDemoSubmission } from '../hooks/demos/useDemoSubmission';

const DemoSubmissionPage: React.FC = () => {
  const { t } = useLanguage();
  const [showMansionDetails, setShowMansionDetails] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const {
    formData,
    isSubmitting,
    feedback,
    handleInputChange,
    handleFileChange,
    handleSubmit,
  } = useDemoSubmission();

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
            <Badge className="mb-6 py-2 px-4 bg-purple-700 text-white">Oportunidade Exclusiva</Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">Junte-se à JESTFLY Mansion</h1>
            <p className="text-xl md:text-2xl text-purple-200 mb-8">Onde sonhos de artistas se tornam realidade. Envie seu demo e entre em um mundo de oportunidades ilimitadas.</p>
            
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
                Envie Seu Demo
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
            <Badge className="mb-4 py-1.5 px-3 bg-purple-700/50 text-white">A EXPERIÊNCIA JESTFLY</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">A Melhor Mansão para Artistas</h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">Mais do que apenas um selo - um ecossistema completo projetado para nutrir artistas e impulsionar carreiras a alturas sem precedentes.</p>
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
              {showMansionDetails ? "Mostrar Menos" : "Saiba Mais Sobre a Mansão"}
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
                    <h3 className="text-2xl font-bold mb-4">Instalações da Mansão</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="p-1 bg-purple-900/30 rounded-full mr-3 mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span>Estúdios de gravação de última geração equipados com os melhores equipamentos</span>
                      </li>
                      <li className="flex items-start">
                        <div className="p-1 bg-purple-900/30 rounded-full mr-3 mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span>Configuração profissional de transmissão ao vivo para alcance global</span>
                      </li>
                      <li className="flex items-start">
                        <div className="p-1 bg-purple-900/30 rounded-full mr-3 mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span>Espaços colaborativos para networking e sessões criativas</span>
                      </li>
                      <li className="flex items-start">
                        <div className="p-1 bg-purple-900/30 rounded-full mr-3 mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span>Suítes de produtores residentes para desenvolvimento contínuo de projetos</span>
                      </li>
                      <li className="flex items-start">
                        <div className="p-1 bg-purple-900/30 rounded-full mr-3 mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span>Lounges e áreas de relaxamento para artistas, fomentando a criatividade</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Nosso Suporte a Artistas</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="p-1 bg-purple-900/30 rounded-full mr-3 mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span>Equipe dedicada de A&R para guiar a progressão de sua carreira</span>
                      </li>
                      <li className="flex items-start">
                        <div className="p-1 bg-purple-900/30 rounded-full mr-3 mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span>Especialistas em marketing para construir sua marca e público</span>
                      </li>
                      <li className="flex items-start">
                        <div className="p-1 bg-purple-900/30 rounded-full mr-3 mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span>Distribuição digital para todas as principais plataformas com análises detalhadas</span>
                      </li>
                      <li className="flex items-start">
                        <div className="p-1 bg-purple-900/30 rounded-full mr-3 mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span>Gestão legal e de direitos para proteger sua propriedade intelectual</span>
                      </li>
                      <li className="flex items-start">
                        <div className="p-1 bg-purple-900/30 rounded-full mr-3 mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span>Mentoria da indústria de artistas e executivos estabelecidos</span>
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
            <Badge className="mb-4 py-1.5 px-3 bg-purple-700/50 text-white">HISTÓRIAS DE SUCESSO</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ouça de Nossos Artistas</h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">Artistas que se juntaram à família JESTFLY compartilham suas experiências transformadoras.</p>
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
                    <p className="text-purple-300">Artista JESTFLY</p>
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
              <Badge className="mb-4 py-1.5 px-3 bg-purple-700/50 text-white">SUA OPORTUNIDADE</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Envie Seu Demo</h2>
              <p className="text-xl text-purple-200 max-w-3xl mx-auto">Dê o primeiro passo para se juntar à JESTFLY Mansion. Nossa equipe de A&R analisa cada submissão com cuidado.</p>
            </div>
            
            <DemoSubmissionForm
              formData={formData}
              isSubmitting={isSubmitting}
              feedback={feedback}
              handleInputChange={handleInputChange}
              handleFileChange={handleFileChange}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
      
      {/* Calendar Section */}
      <div className="py-16 bg-[#1A1F2C]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Calendar className="h-8 w-8 text-purple-400 mr-3" />
              <h2 className="text-3xl font-bold">Próximos Eventos JESTFLY</h2>
            </div>
            <p className="text-xl text-purple-200 mb-12">Participe destes eventos exclusivos e experimente o clima da JESTFLY Mansion</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6 hover:bg-black/50 transition-all duration-300">
                <div className="text-purple-300 text-lg font-semibold mb-2">15 de Julho, 2023</div>
                <h3 className="text-2xl font-bold mb-3">Noite de Showcase de Produtores</h3>
                <p className="text-white/80 mb-4">Uma noite apresentando nossos melhores produtores exibindo seus últimos beats e técnicas de produção.</p>
                <Badge className="bg-purple-900/50 text-white">Los Angeles, CA</Badge>
              </div>
              
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6 hover:bg-black/50 transition-all duration-300">
                <div className="text-purple-300 text-lg font-semibold mb-2">22 de Agosto, 2023</div>
                <h3 className="text-2xl font-bold mb-3">Festival de Verão JESTFLY</h3>
                <p className="text-white/80 mb-4">Nosso encontro anual de verão com apresentações ao vivo de artistas JESTFLY e convidados especiais.</p>
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
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Pronto para Transformar Sua Carreira?</h2>
            <p className="text-xl text-purple-200 mb-12 max-w-3xl mx-auto">Junte-se à comunidade exclusiva de artistas que encontraram seu lar na JESTFLY Mansion. Envie seu demo hoje e dê o primeiro passo.</p>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6"
              onClick={() => {
                const demoForm = document.getElementById('demo-form');
                if (demoForm) demoForm.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Star className="mr-2 h-5 w-5" />
              Inicie Sua Jornada JESTFLY
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
            <SheetTitle className="text-white text-xl">Sobre a JESTFLY Mansion</SheetTitle>
            <SheetDescription className="text-white/70">
              A melhor comunidade de artistas e espaço criativo
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <p>A JESTFLY Mansion é mais que um selo musical - é um movimento projetado para elevar artistas ao seu pleno potencial no cenário musical digital atual.</p>
            <p>O que nos diferencia:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Abordagem artist-first com divisões justas de royalties</li>
              <li>Rede global de conexões da indústria</li>
              <li>Oportunidades regulares de transmissão ao vivo</li>
              <li>Acesso a recursos profissionais de produção</li>
              <li>Marketing e desenvolvimento de marca</li>
              <li>Comunidade colaborativa de artistas com pensamento semelhante</li>
            </ul>
            <div className="pt-4">
              <h3 className="font-bold mb-2">Informações de Contato</h3>
              <p>Email: contato@jestflymansion.com</p>
              <p>Telefone: (555) 123-4567</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      <Footer />
    </div>
  );
};

export default DemoSubmissionPage;
