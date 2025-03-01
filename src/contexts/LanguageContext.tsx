
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define available languages
type Language = 'en' | 'pt';

// Translations dictionary
type Translations = {
  [key: string]: {
    [key in Language]: string;
  };
};

// Initial translations
const translations: Translations = {
  // Common
  'nav.home': {
    en: 'Home',
    pt: 'Início',
  },
  'nav.store': {
    en: 'Store',
    pt: 'Loja',
  },
  'nav.community': {
    en: 'Community',
    pt: 'Comunidade',
  },
  'nav.bookings': {
    en: 'Bookings',
    pt: 'Reservas',
  },
  'nav.profile': {
    en: 'Profile',
    pt: 'Perfil',
  },
  'nav.demo': {
    en: 'Demo Submission',
    pt: 'Enviar Demo',
  },
  'nav.live': {
    en: 'Live Stream',
    pt: 'Transmissão ao Vivo',
  },
  'nav.press': {
    en: 'Press Kit',
    pt: 'Kit de Imprensa',
  },
  'nav.admin': {
    en: 'Admin',
    pt: 'Administração',
  },
  
  // Demo Submission
  'demo.title': {
    en: 'Submit Your Demo',
    pt: 'Envie Sua Demo',
  },
  'demo.subtitle': {
    en: 'Join the exclusive JESTFLY roster',
    pt: 'Junte-se ao seleto grupo JESTFLY',
  },
  'demo.description': {
    en: 'Submit your music demo to be considered for release on JESTFLY Records and become a member of the exclusive JESTFLY Mansion VIP.',
    pt: 'Envie sua demo musical para ser considerada para lançamento pela JESTFLY Records e torne-se membro exclusivo do JESTFLY Mansion VIP.',
  },
  'demo.form.name': {
    en: 'Artist Name',
    pt: 'Nome do Artista',
  },
  'demo.form.email': {
    en: 'Email',
    pt: 'Email',
  },
  'demo.form.genre': {
    en: 'Genre',
    pt: 'Gênero',
  },
  'demo.form.bio': {
    en: 'Biography',
    pt: 'Biografia',
  },
  'demo.form.links': {
    en: 'Social Media Links',
    pt: 'Links de Redes Sociais',
  },
  'demo.form.upload': {
    en: 'Upload Demo',
    pt: 'Carregar Demo',
  },
  'demo.form.submit': {
    en: 'Submit Demo',
    pt: 'Enviar Demo',
  },
  
  // Live Stream
  'live.title': {
    en: 'Live Stream',
    pt: 'Transmissão ao Vivo',
  },
  'live.connect': {
    en: 'Connect With Fans',
    pt: 'Conecte-se Com os Fãs',
  },
  'live.platforms': {
    en: 'Stream to Multiple Platforms',
    pt: 'Transmita para Várias Plataformas',
  },
  'live.start': {
    en: 'Start Streaming',
    pt: 'Iniciar Transmissão',
  },
  'live.comments': {
    en: 'Comments',
    pt: 'Comentários',
  },
  'live.facebook': {
    en: 'Facebook',
    pt: 'Facebook',
  },
  'live.instagram': {
    en: 'Instagram',
    pt: 'Instagram',
  },
  'live.youtube': {
    en: 'YouTube',
    pt: 'YouTube',
  },
  
  // Press Kit
  'press.title': {
    en: 'Press Kit',
    pt: 'Kit de Imprensa',
  },
  'press.subtitle': {
    en: 'Media Resources',
    pt: 'Recursos para Mídia',
  },
  'press.description': {
    en: 'Access high-quality press materials for your coverage. Enter your details below to gain access.',
    pt: 'Acesse materiais de imprensa de alta qualidade para sua cobertura. Insira seus dados abaixo para obter acesso.',
  },
  'press.form.name': {
    en: 'Full Name',
    pt: 'Nome Completo',
  },
  'press.form.email': {
    en: 'Email',
    pt: 'Email',
  },
  'press.form.outlet': {
    en: 'Media Outlet',
    pt: 'Veículo de Mídia',
  },
  'press.form.submit': {
    en: 'Access Press Kit',
    pt: 'Acessar Kit de Imprensa',
  },
};

// Context interface
interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create Context
const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Provider Component
export const LanguageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Translation function
  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    console.warn(`Translation key "${key}" missing for language: ${language}`);
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageProvider;
