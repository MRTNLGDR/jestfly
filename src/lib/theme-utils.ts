
import { themeColors, borders, effects, transitions } from '../styles/theme.tsx';

// Function to get Tailwind theme colors
export function getTailwindThemeColors() {
  const { primary, secondary, accent } = themeColors;
  return {
    primary, 
    secondary,
    accent
  };
}

// Function to get Tailwind typography
export function getTailwindTypography() {
  return {};
}

// Function to get Tailwind borders
export function getTailwindBorders() {
  return { borderRadius: borders.radius };
}

// Function to get Tailwind effects
export function getTailwindEffects() {
  return {
    boxShadow: effects.shadows,
    backdropBlur: effects.blurs
  };
}

// Function to get Tailwind transitions
export function getTailwindTransitions() {
  return {
    transitionDuration: transitions.duration,
    transitionTimingFunction: transitions.timing
  };
}
