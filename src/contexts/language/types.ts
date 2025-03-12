
// Define available languages and currencies
export type Language = 'en' | 'pt' | 'es';
export type Currency = 'USD' | 'BRL' | 'EUR' | 'ETH';

// Context interface
export interface LanguageContextProps {
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

export type Translations = {
  [key: string]: {
    [key in Language]: string;
  };
};
