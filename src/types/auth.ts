
// Tipos centralizados para autenticação e perfis de usuário

export type ProfileType = 'fan' | 'artist' | 'collaborator' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  display_name: string;
  bio?: string;
  avatar_url: string;
  cover_image?: string;
  website?: string;
  social_links?: {
    instagram?: string;
    twitter?: string;
    soundcloud?: string;
    spotify?: string;
    youtube?: string;
    discord?: string;
  };
  followers_count: number;
  following_count: number;
  jest_coins?: number;
  created_at: string;
  updated_at?: string;
  last_login?: string;
  profile_type: ProfileType;
  is_verified: boolean;
  verified_at?: string;
  preferences?: {
    email_notifications: boolean;
    push_notifications: boolean;
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
  activity_status?: 'online' | 'offline' | 'away';
  stats?: {
    posts_count: number;
    likes_received: number;
    comments_received: number;
    bookings_count: number;
    events_attended: number;
    products_purchased: number;
  };
  roles?: string[];
  permissions?: string[];
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  username: string;
  profileType: ProfileType;
}

export interface AuthContextType {
  currentUser: any | null;
  userData: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshUserData: () => Promise<void>;
  isAdmin: boolean;
  isArtist: boolean;
  hasPermission: (requiredPermission: ProfileType | ProfileType[]) => boolean;
  setUserData?: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setError?: React.Dispatch<React.SetStateAction<string | null>>;
}
