
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define available languages and currencies
type Language = 'en' | 'pt' | 'es';
type Currency = 'USD' | 'BRL' | 'EUR' | 'ETH';

// Currency conversion rates (base: USD)
const currencyRates = {
  USD: 1,
  BRL: 5.08,
  EUR: 0.92,
  ETH: 0.0000464 // ETH per USD (approx. value)
};

// JestCoin value in different currencies
const jestCoinValue = {
  USD: 0.25, // $0.25 USD per JestCoin
  BRL: 0.25 * currencyRates.BRL, // BRL per JestCoin
  EUR: 0.25 * currencyRates.EUR, // EUR per JestCoin
  ETH: 0.0000125 // ETH per JestCoin (direct value)
};

// Translations dictionary
type Translations = {
  [key: string]: {
    [key in Language]: string;
  };
};

// Currency symbols
const currencySymbols = {
  USD: '$',
  BRL: 'R$',
  EUR: '€',
  ETH: 'Ξ'
};

// Initial translations
const translations: Translations = {
  // Common
  'nav.home': {
    en: 'Home',
    pt: 'Início',
    es: 'Inicio',
  },
  'nav.store': {
    en: 'Store',
    pt: 'Loja',
    es: 'Tienda',
  },
  'nav.community': {
    en: 'Community',
    pt: 'Comunidade',
    es: 'Comunidad',
  },
  'nav.bookings': {
    en: 'Bookings',
    pt: 'Reservas',
    es: 'Reservas',
  },
  'nav.profile': {
    en: 'Profile',
    pt: 'Perfil',
    es: 'Perfil',
  },
  'nav.demo': {
    en: 'Demo Submission',
    pt: 'Enviar Demo',
    es: 'Enviar Demo',
  },
  'nav.live': {
    en: 'Live Stream',
    pt: 'Transmissão ao Vivo',
    es: 'Transmisión en Vivo',
  },
  'nav.press': {
    en: 'Press Kit',
    pt: 'Kit de Imprensa',
    es: 'Kit de Prensa',
  },
  'nav.admin': {
    en: 'Admin',
    pt: 'Administração',
    es: 'Administración',
  },
  
  // Currency and language
  'language.en': {
    en: 'English',
    pt: 'Inglês',
    es: 'Inglés',
  },
  'language.pt': {
    en: 'Portuguese',
    pt: 'Português',
    es: 'Portugués',
  },
  'language.es': {
    en: 'Spanish',
    pt: 'Espanhol',
    es: 'Español',
  },
  'currency.USD': {
    en: 'US Dollar',
    pt: 'Dólar Americano',
    es: 'Dólar Estadounidense',
  },
  'currency.BRL': {
    en: 'Brazilian Real',
    pt: 'Real Brasileiro',
    es: 'Real Brasileño',
  },
  'currency.EUR': {
    en: 'Euro',
    pt: 'Euro',
    es: 'Euro',
  },
  'currency.ETH': {
    en: 'Ethereum',
    pt: 'Ethereum',
    es: 'Ethereum',
  },
  
  // Demo Submission
  'demo.title': {
    en: 'Submit Your Demo',
    pt: 'Envie Sua Demo',
    es: 'Envía Tu Demo',
  },
  'demo.subtitle': {
    en: 'Join the exclusive JESTFLY roster',
    pt: 'Junte-se ao seleto grupo JESTFLY',
    es: 'Únete al selecto grupo JESTFLY',
  },
  'demo.description': {
    en: 'Submit your music demo to be considered for release on JESTFLY Records and become a member of the exclusive JESTFLY Mansion VIP.',
    pt: 'Envie sua demo musical para ser considerada para lançamento pela JESTFLY Records e torne-se membro exclusivo do JESTFLY Mansion VIP.',
    es: 'Envía tu demo musical para ser considerado para lanzamiento en JESTFLY Records y conviértete en miembro exclusivo de JESTFLY Mansion VIP.',
  },
  'demo.form.name': {
    en: 'Artist Name',
    pt: 'Nome do Artista',
    es: 'Nombre del Artista',
  },
  'demo.form.email': {
    en: 'Email',
    pt: 'Email',
    es: 'Correo Electrónico',
  },
  'demo.form.genre': {
    en: 'Genre',
    pt: 'Gênero',
    es: 'Género',
  },
  'demo.form.bio': {
    en: 'Biography',
    pt: 'Biografia',
    es: 'Biografía',
  },
  'demo.form.links': {
    en: 'Social Media Links',
    pt: 'Links de Redes Sociais',
    es: 'Enlaces de Redes Sociales',
  },
  'demo.form.upload': {
    en: 'Upload Demo',
    pt: 'Carregar Demo',
    es: 'Subir Demo',
  },
  'demo.form.submit': {
    en: 'Submit Demo',
    pt: 'Enviar Demo',
    es: 'Enviar Demo',
  },
  
  // Live Stream
  'live.title': {
    en: 'Live Stream',
    pt: 'Transmissão ao Vivo',
    es: 'Transmisión en Vivo',
  },
  'live.connect': {
    en: 'Connect With Fans',
    pt: 'Conecte-se Com os Fãs',
    es: 'Conéctate Con los Fans',
  },
  'live.platforms': {
    en: 'Stream to Multiple Platforms',
    pt: 'Transmita para Várias Plataformas',
    es: 'Transmite a Múltiples Plataformas',
  },
  'live.start': {
    en: 'Start Streaming',
    pt: 'Iniciar Transmissão',
    es: 'Iniciar Transmisión',
  },
  'live.comments': {
    en: 'Comments',
    pt: 'Comentários',
    es: 'Comentarios',
  },
  'live.facebook': {
    en: 'Facebook',
    pt: 'Facebook',
    es: 'Facebook',
  },
  'live.instagram': {
    en: 'Instagram',
    pt: 'Instagram',
    es: 'Instagram',
  },
  'live.youtube': {
    en: 'YouTube',
    pt: 'YouTube',
    es: 'YouTube',
  },
  
  // Press Kit
  'press.title': {
    en: 'Press Kit',
    pt: 'Kit de Imprensa',
    es: 'Kit de Prensa',
  },
  'press.subtitle': {
    en: 'Media Resources',
    pt: 'Recursos para Mídia',
    es: 'Recursos para Medios',
  },
  'press.description': {
    en: 'Access high-quality press materials for your coverage. Enter your details below to gain access.',
    pt: 'Acesse materiais de imprensa de alta qualidade para sua cobertura. Insira seus dados abaixo para obter acesso.',
    es: 'Accede a materiales de prensa de alta calidad para tu cobertura. Ingresa tus datos a continuación para obtener acceso.',
  },
  'press.form.name': {
    en: 'Full Name',
    pt: 'Nome Completo',
    es: 'Nombre Completo',
  },
  'press.form.email': {
    en: 'Email',
    pt: 'Email',
    es: 'Correo Electrónico',
  },
  'press.form.outlet': {
    en: 'Media Outlet',
    pt: 'Veículo de Mídia',
    es: 'Medio de Comunicación',
  },
  'press.form.submit': {
    en: 'Access Press Kit',
    pt: 'Acessar Kit de Imprensa',
    es: 'Acceder al Kit de Prensa',
  },
  
  // Shop
  'shop.title': {
    en: 'Shop',
    pt: 'Loja',
    es: 'Tienda',
  },
  'shop.addToCart': {
    en: 'Add to Cart',
    pt: 'Adicionar ao Carrinho',
    es: 'Añadir al Carrito',
  },
  'shop.viewDetails': {
    en: 'View Details',
    pt: 'Ver Detalhes',
    es: 'Ver Detalles',
  },
  'shop.browseAll': {
    en: 'Browse All',
    pt: 'Ver Todos',
    es: 'Ver Todos',
  },
};

// Context interface
interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  t: (key: string) => string;
  formatCurrency: (amount: number) => string;
  convertToJestCoin: (amount: number) => number;
  convertFromJestCoin: (jestCoins: number) => number;
  currencySymbol: string;
  jestCoinInCurrency: number;
  availableLanguages: Language[];
  availableCurrencies: Currency[];
}

// Create Context
const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

// Provider Component
export const LanguageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');
  
  const availableLanguages: Language[] = ['en', 'pt', 'es'];
  const availableCurrencies: Currency[] = ['USD', 'BRL', 'EUR', 'ETH'];

  // Translation function
  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    console.warn(`Translation key "${key}" missing for language: ${language}`);
    return key;
  };
  
  // Current currency symbol
  const currencySymbol = currencySymbols[currency];
  
  // JestCoin value in current currency
  const jestCoinInCurrency = jestCoinValue[currency];
  
  // Format currency based on current selection
  const formatCurrency = (amount: number): string => {
    if (currency === 'ETH') {
      // For ETH, show more decimal places
      return `${currencySymbol}${amount.toFixed(6)}`;
    }
    
    // For fiat currencies
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'symbol',
    }).format(amount);
  };
  
  // Convert any amount to equivalent JestCoins
  const convertToJestCoin = (amount: number): number => {
    return amount / jestCoinInCurrency;
  };
  
  // Convert JestCoins to current currency
  const convertFromJestCoin = (jestCoins: number): number => {
    return jestCoins * jestCoinInCurrency;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      currency, 
      setCurrency, 
      t, 
      formatCurrency, 
      convertToJestCoin,
      convertFromJestCoin,
      currencySymbol,
      jestCoinInCurrency,
      availableLanguages,
      availableCurrencies
    }}>
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
