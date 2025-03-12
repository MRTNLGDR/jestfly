
export interface User {
  id: string;
  email: string;
  displayName: string;
  username: string;
  profileType: 'fan' | 'artist' | 'admin' | 'collaborator';
  bio?: string;
  avatar?: string | null;
  walletAddress?: string;
  permissions?: string[];
  roles?: string[];
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
    soundcloud?: string;
    youtube?: string;
    tiktok?: string;
    [key: string]: string | undefined;
  };
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    language: 'en' | 'pt' | 'es' | 'fr';
    currency: 'USD' | 'EUR' | 'BRL' | 'GBP';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      [key: string]: boolean | undefined;
    };
    [key: string]: any;
  };
  isVerified?: boolean;
  twoFactorEnabled?: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
