
import React, { createContext, useContext, ReactNode } from 'react';
import { ThemeContextType, ThemeType } from './theme-types';

// Definição do tema principal
export const themeColors = {
  // Cores primárias
  primary: {
    DEFAULT: '#8B5CF6', // Roxo vibrante
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
    950: '#2E1065',
  },
  
  // Cores secundárias
  secondary: {
    DEFAULT: '#4ade80', // Verde vibrante
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  
  // Cores de destaque
  accent: {
    DEFAULT: '#0ea5e9', // Azul vibrante
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  
  // Tons de cinza
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
  
  // Cores de estado
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Cores de fundo
  background: {
    default: '#000000',
    card: 'rgba(10, 10, 12, 0.8)',
    popup: 'rgba(17, 17, 23, 0.9)',
    glass: 'rgba(255, 255, 255, 0.05)',
  },
  
  // Cores de texto
  text: {
    primary: 'rgba(255, 255, 255, 0.9)',
    secondary: 'rgba(255, 255, 255, 0.7)',
    tertiary: 'rgba(255, 255, 255, 0.5)',
    muted: 'rgba(255, 255, 255, 0.3)',
  },
  
  // Gradientes
  gradients: {
    primary: 'linear-gradient(to right, #8B5CF6, #4ade80)',
    secondary: 'linear-gradient(to right, #4ade80, #0ea5e9)',
    purple: 'linear-gradient(to right, #c026d3, #8B5CF6)',
    blue: 'linear-gradient(to right, #3b82f6, #0ea5e9)',
    green: 'linear-gradient(to right, #10b981, #4ade80)',
    gold: 'linear-gradient(to right, #f59e0b, #fbbf24)',
    glass: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
  }
};

// Tipografia
export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
    display: 'Inter, system-ui, sans-serif',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontSize: {
    'display-2xl': '4.5rem',
    'display-xl': '3.75rem',
    'display-lg': '3rem',
    'display-md': '2.5rem',
    'display-sm': '2rem',
    'display-xs': '1.75rem',
    'title-lg': '1.5rem',
    'title-md': '1.25rem',
    'title-sm': '1.125rem',
    'body-lg': '1.125rem',
    'body-md': '1rem',
    'body-sm': '0.875rem',
    'caption': '0.75rem',
  },
  lineHeight: {
    tight: 1.15,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tighter: '-0.02em',
    tight: '-0.01em',
    normal: '0em',
    wide: '0.01em',
    wider: '0.02em',
  },
};

// Espaçamento
export const spacing = {
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
};

// Bordas e arredondamentos
export const borders = {
  radius: {
    none: '0',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  width: {
    DEFAULT: '1px',
    0: '0px',
    2: '2px',
    4: '4px',
    8: '8px',
  },
};

// Efeitos
export const effects = {
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    neon: '0 0 10px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)',
    'neon-green': '0 0 10px rgba(74, 222, 128, 0.5), 0 0 20px rgba(74, 222, 128, 0.3)',
    'neon-blue': '0 0 10px rgba(14, 165, 233, 0.5), 0 0 20px rgba(14, 165, 233, 0.3)',
  },
  blurs: {
    none: '0',
    sm: '4px',
    DEFAULT: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '40px',
    '3xl': '64px',
  },
  glassmorphism: {
    light: 'backdrop-filter: blur(8px); background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.1);',
    medium: 'backdrop-filter: blur(12px); background-color: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.1);',
    dark: 'backdrop-filter: blur(16px); background-color: rgba(0, 0, 0, 0.6); border: 1px solid rgba(255, 255, 255, 0.05);',
  },
};

// Transições e animações
export const transitions = {
  duration: {
    DEFAULT: '150ms',
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
    slowest: '700ms',
  },
  timing: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Definição do tema completo
export const theme: ThemeType = {
  colors: themeColors,
  typography,
  spacing,
  borders,
  effects,
  transitions,
};

// Contexto do tema
const ThemeContext = createContext<ThemeContextType>(theme);

// Provider para o tema
export const ThemeProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para acessar o tema
export const useTheme = () => useContext(ThemeContext);

export default theme;
