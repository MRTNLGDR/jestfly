
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
    [key: string]: string | undefined;
  };
  walletAddress?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      [key: string]: boolean | undefined;
    };
    language: string;
    currency: string;
    [key: string]: any;
  };
  roles?: string[];
  adminCode?: string; // Código usado para registro de admin
}
