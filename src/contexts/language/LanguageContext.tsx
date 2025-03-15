
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Language, Currency, LanguageContextProps } from './types';
import { 
  currencySymbols, 
  jestCoinValue, 
  formatCurrencyValue, 
  convertToJestCoinValue, 
  convertFromJestCoinValue 
} from './currencyUtils';
import { translations } from './translations';

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
    return formatCurrencyValue(amount, currency);
  };
  
  // Convert any amount to equivalent JestCoins
  const convertToJestCoin = (amount: number): number => {
    return convertToJestCoinValue(amount, currency);
  };
  
  // Convert JestCoins to current currency
  const convertFromJestCoin = (jestCoins: number): number => {
    return convertFromJestCoinValue(jestCoins, currency);
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
