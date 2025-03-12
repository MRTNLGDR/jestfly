export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  is_featured?: boolean;
  is_pinned?: boolean;
  author?: {
    username: string;
    displayName: string;
    avatar?: string;
  };
  shares_count?: number;
  tags?: string[];
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  author?: {
    username: string;
    displayName: string;
    avatar?: string;
  };
}

export interface PostLike {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

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

export interface UserFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}
