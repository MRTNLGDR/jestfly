
// Define types for theme
export type ThemeContextType = typeof theme;

export type ThemeColorType = {
  DEFAULT: string;
  50?: string;
  100?: string;
  200?: string;
  300?: string;
  400?: string;
  500?: string;
  600?: string;
  700?: string;
  800?: string;
  900?: string;
  950?: string;
  foreground?: string;
  'primary-foreground'?: string;
  'accent-foreground'?: string;
};

export type ThemeColorsType = {
  primary: ThemeColorType;
  secondary: ThemeColorType;
  accent: ThemeColorType;
  gray: Omit<ThemeColorType, 'DEFAULT'> & { [key: string]: string };
  success: string;
  warning: string;
  error: string;
  info: string;
  background: {
    default: string;
    card: string;
    popup: string;
    glass: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
  };
  gradients: {
    [key: string]: string;
  };
};

export type TypographyType = {
  fontFamily: {
    sans: string;
    mono: string;
    display: string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  fontSize: {
    [key: string]: string;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
  };
};

export type SpacingType = {
  [key: string | number]: string;
};

export type BordersType = {
  radius: {
    none: string;
    sm: string;
    DEFAULT: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    full: string;
  };
  width: {
    DEFAULT: string;
    0: string;
    2: string;
    4: string;
    8: string;
  };
};

export type EffectsType = {
  shadows: {
    [key: string]: string;
  };
  blurs: {
    [key: string]: string;
  };
  glassmorphism: {
    light: string;
    medium: string;
    dark: string;
  };
};

export type TransitionsType = {
  duration: {
    [key: string]: string;
  };
  timing: {
    [key: string]: string;
  };
};

export type ThemeType = {
  colors: ThemeColorsType;
  typography: TypographyType;
  spacing: SpacingType;
  borders: BordersType;
  effects: EffectsType;
  transitions: TransitionsType;
};

// Export a placeholder theme object to satisfy imports
export const theme: ThemeType = {
  colors: {} as ThemeColorsType,
  typography: {} as TypographyType,
  spacing: {} as SpacingType,
  borders: {} as BordersType,
  effects: {} as EffectsType,
  transitions: {} as TransitionsType
};
