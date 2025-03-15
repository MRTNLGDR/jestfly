
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
  profile_type: 'fan' | 'artist' | 'collaborator' | 'admin';
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

export interface SessionUser {
  id: string;
  email: string;
  username?: string;
  display_name?: string;
  avatar?: string;
  profile_type?: 'fan' | 'artist' | 'collaborator' | 'admin';
  is_verified?: boolean;
  jest_coins?: number;
}

export interface UserAuth {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: SessionUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData?: any) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

export interface UserFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface UserNotification {
  id: string;
  user_id: string;
  type: 'follow' | 'like' | 'comment' | 'mention' | 'system' | 'booking' | 'payment';
  content: string;
  related_id?: string;
  related_type?: string;
  is_read: boolean;
  created_at: string;
}
