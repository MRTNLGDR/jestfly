
export interface User {
  id: string;
  email: string;
  displayName: string;
  username: string;
  profileType: 'artist' | 'fan' | 'admin' | 'collaborator';
  avatar?: string;
  bio?: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
    youtube?: string;
    website?: string;
  };
  walletAddress?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: any;
    language: 'en' | 'pt' | 'es' | 'fr';
    currency: 'USD' | 'EUR' | 'BRL' | 'JEST';
  };
}
