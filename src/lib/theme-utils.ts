
import { theme } from '../styles/theme.tsx';

export const getTailwindThemeColors = () => {
  const colors = theme.colors;
  
  return {
    'primary-color': colors.primary.DEFAULT,
    'secondary-color': colors.secondary.DEFAULT,
    'accent-color': colors.accent.DEFAULT,
  };
};

export const getTailwindTypography = () => {
  const typography = theme.typography;
  
  return {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    lineHeight: typography.lineHeight,
    letterSpacing: typography.letterSpacing,
  };
};

export const getTailwindBorders = () => {
  const borders = theme.borders;
  
  return {
    borderRadius: borders.radius,
    borderWidth: borders.width,
  };
};

export const getTailwindEffects = () => {
  const effects = theme.effects;
  
  return {
    boxShadow: effects.shadows,
    backdropBlur: effects.blurs,
    glassmorphism: effects.glassmorphism,
  };
};

export const getTailwindTransitions = () => {
  const transitions = theme.transitions;
  
  return {
    transitionDuration: transitions.duration,
    transitionTimingFunction: transitions.timing,
  };
};
