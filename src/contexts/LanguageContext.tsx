
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create context with a default value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define translations
const translations = {
  en: {
    // Header
    'nav.home': 'Home',
    'nav.store': 'Store',
    'nav.community': 'Community',
    'nav.bookings': 'Bookings',
    'nav.notes': 'Notes',
    'nav.profile': 'Profile',
    'nav.demos': 'Demos',
    'nav.livestream': 'Live',
    'nav.presskit': 'Press Kit',
    'nav.jestcoin': 'JestCoin',
    'nav.airdrop': 'Airdrop',
    'nav.admin': 'Admin',
    'nav.login': 'Log In',
    'nav.register': 'Register',
    'nav.logout': 'Log Out',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.submit': 'Submit',
    'common.search': 'Search',
    
    // Auth
    'auth.login': 'Log In',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.hasAccount': 'Already have an account?',
    'auth.registerNow': 'Register Now',
    'auth.loginNow': 'Log In Now',
    
    // Community
    'community.title': 'Community',
    'community.posts': 'Posts',
    'community.events': 'Events',
    'community.giveaways': 'Giveaways',
    'community.jestflyers': 'JestFlyers Hub',
    'community.newPost': 'New Post',
    'community.comments': 'Comments',
    'community.writeComment': 'Write a comment...',
    
    // Store
    'store.title': 'Store',
    'store.products': 'Products',
    'store.cart': 'Cart',
    'store.checkout': 'Checkout',
    'store.addToCart': 'Add to Cart',
    
    // Profile
    'profile.title': 'Profile',
    'profile.edit': 'Edit Profile',
    'profile.settings': 'Settings',
    'profile.activity': 'Activity',
    
    // JestCoin
    'jestcoin.title': 'JestCoin',
    'jestcoin.balance': 'Balance',
    'jestcoin.transactions': 'Transactions',
    'jestcoin.rewards': 'Rewards',
    
    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.users': 'Users',
    'admin.content': 'Content',
    'admin.settings': 'Settings',
    'admin.logs': 'Logs',
    
    // Footer
    'footer.copyright': '© 2024 JESTFLY. All rights reserved.',
    'footer.terms': 'Terms',
    'footer.privacy': 'Privacy',
    'footer.contact': 'Contact',
  },
  pt: {
    // Header
    'nav.home': 'Início',
    'nav.store': 'Loja',
    'nav.community': 'Comunidade',
    'nav.bookings': 'Reservas',
    'nav.notes': 'Notas',
    'nav.profile': 'Perfil',
    'nav.demos': 'Demos',
    'nav.livestream': 'Ao Vivo',
    'nav.presskit': 'Kit de Imprensa',
    'nav.jestcoin': 'JestCoin',
    'nav.airdrop': 'Airdrop',
    'nav.admin': 'Admin',
    'nav.login': 'Entrar',
    'nav.register': 'Cadastrar',
    'nav.logout': 'Sair',
    
    // Common
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Excluir',
    'common.submit': 'Enviar',
    'common.search': 'Pesquisar',
    
    // Auth
    'auth.login': 'Entrar',
    'auth.register': 'Cadastrar',
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.forgotPassword': 'Esqueceu a senha?',
    'auth.noAccount': 'Não tem uma conta?',
    'auth.hasAccount': 'Já tem uma conta?',
    'auth.registerNow': 'Cadastre-se Agora',
    'auth.loginNow': 'Entre Agora',
    
    // Community
    'community.title': 'Comunidade',
    'community.posts': 'Postagens',
    'community.events': 'Eventos',
    'community.giveaways': 'Sorteios',
    'community.jestflyers': 'Hub de JestFlyers',
    'community.newPost': 'Nova Postagem',
    'community.comments': 'Comentários',
    'community.writeComment': 'Escreva um comentário...',
    
    // Store
    'store.title': 'Loja',
    'store.products': 'Produtos',
    'store.cart': 'Carrinho',
    'store.checkout': 'Finalizar Compra',
    'store.addToCart': 'Adicionar ao Carrinho',
    
    // Profile
    'profile.title': 'Perfil',
    'profile.edit': 'Editar Perfil',
    'profile.settings': 'Configurações',
    'profile.activity': 'Atividade',
    
    // JestCoin
    'jestcoin.title': 'JestCoin',
    'jestcoin.balance': 'Saldo',
    'jestcoin.transactions': 'Transações',
    'jestcoin.rewards': 'Recompensas',
    
    // Admin
    'admin.dashboard': 'Painel',
    'admin.users': 'Usuários',
    'admin.content': 'Conteúdo',
    'admin.settings': 'Configurações',
    'admin.logs': 'Logs',
    
    // Footer
    'footer.copyright': '© 2024 JESTFLY. Todos os direitos reservados.',
    'footer.terms': 'Termos',
    'footer.privacy': 'Privacidade',
    'footer.contact': 'Contato',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  // Load saved language from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
