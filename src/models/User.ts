
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

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
    notifications: NotificationPreferences;
    language: 'en' | 'pt' | 'es' | 'fr';
    currency: 'USD' | 'EUR' | 'BRL' | 'JEST';
  };
  // Relationships
  artistProfile?: ArtistProfile;
  collectionItems: string[]; // IDs dos itens na coleção
  transactions: Transaction[];
  membership?: Membership;
}

export interface ArtistProfile {
  userId: string;
  artistName: string;
  genre: string[];
  bio: string;
  profileImage: string;
  bannerImage?: string;
  releases: Release[];
  events: Event[];
  pressKit?: PressKit;
  verified: boolean;
  featuredArtist: boolean;
  followers: number;
  jestRank: number; // Ranking na plataforma
}

export interface Release {
  id: string;
  title: string;
  releaseDate: Date;
  coverImage: string;
  type: 'album' | 'single' | 'ep';
  tracks: Track[];
}

export interface Track {
  id: string;
  title: string;
  duration: number;
  fileUrl?: string;
}

export interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
  description?: string;
  imageUrl?: string;
  ticketUrl?: string;
}

export interface PressKit {
  bio: string;
  images: string[];
  videos: string[];
  documents: string[];
  contacts: string[];
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'award' | 'raffle';
  amount: number;
  currency: 'USD' | 'EUR' | 'BRL' | 'JEST';
  timestamp: Date;
  description?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
}

export interface Membership {
  type: 'free' | 'premium' | 'platinum';
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  features: string[];
}
