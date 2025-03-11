
import { theme } from '../styles/theme.tsx';
import { ThemeColorsType, TypographyType, EffectsType, TransitionsType } from '../styles/theme-types';

// Provide default empty values to prevent undefined errors
const defaultTheme = {
  colors: {
    primary: { DEFAULT: '#8B5CF6' },
    secondary: { DEFAULT: '#4ade80' },
    accent: { DEFAULT: '#0ea5e9' }
  },
  typography: {
    fontFamily: {},
    fontSize: {},
    lineHeight: {},
    letterSpacing: {},
  },
  effects: {
    shadows: {},
    blurs: {},
    glassmorphism: {},
  },
  transitions: {
    duration: {},
    timing: {},
  },
};

export const getTailwindThemeColors = () => {
  const colors = theme?.colors || defaultTheme.colors;
  return {
    'primary-color': colors.primary?.DEFAULT || '#8B5CF6',
    'secondary-color': colors.secondary?.DEFAULT || '#4ade80',
    'accent-color': colors.accent?.DEFAULT || '#0ea5e9',
  };
};

export const getTailwindTypography = () => {
  const typography = theme?.typography || defaultTheme.typography;
  return {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    lineHeight: typography.lineHeight,
    letterSpacing: typography.letterSpacing,
  };
};

export const getTailwindBorders = () => {
  return theme?.borders || {};
};

export const getTailwindEffects = () => {
  const effects = theme?.effects || defaultTheme.effects;
  return {
    boxShadow: effects.shadows || {},
    backdropBlur: effects.blurs || {},
  };
};

export const getTailwindTransitions = () => {
  const transitions = theme?.transitions || defaultTheme.transitions;
  return {
    transitionDuration: transitions.duration || {},
    transitionTimingFunction: transitions.timing || {},
  };
};
