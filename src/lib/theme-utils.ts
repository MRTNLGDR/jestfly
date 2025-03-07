
import { themeColors, typography, borders, effects, transitions } from '@/styles/theme';

/**
 * Converte um objeto de cores para hsl ou rgb no formato que o Tailwind espera
 */
export function formatTailwindThemeColors(colors: any) {
  const formatted: any = {};
  
  for (const [key, value] of Object.entries(colors)) {
    if (typeof value === 'string') {
      formatted[key] = value;
    } else if (typeof value === 'object') {
      formatted[key] = formatTailwindThemeColors(value);
    }
  }
  
  return formatted;
}

/**
 * Extrai todas as cores para uso no arquivo tailwind.config.ts
 */
export function getTailwindThemeColors() {
  return formatTailwindThemeColors(themeColors);
}

/**
 * Obtém a configuração de tipografia para o Tailwind
 */
export function getTailwindTypography() {
  return {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: typography.lineHeight,
    letterSpacing: typography.letterSpacing,
  };
}

/**
 * Obtém a configuração de bordas para o Tailwind
 */
export function getTailwindBorders() {
  return {
    borderRadius: borders.radius,
    borderWidth: borders.width,
  };
}

/**
 * Obtém a configuração de efeitos para o Tailwind
 */
export function getTailwindEffects() {
  return {
    boxShadow: effects.shadows,
    backdropBlur: effects.blurs,
  };
}

/**
 * Obtém a configuração de transições para o Tailwind
 */
export function getTailwindTransitions() {
  return {
    transitionDuration: transitions.duration,
    transitionTimingFunction: transitions.timing,
  };
}
