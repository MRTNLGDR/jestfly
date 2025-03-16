import { Json } from './types';

/**
 * This file extends the Supabase types without modifying the original types.ts file
 */

// Define additional types used in the application
export type ModelType = 'diamond' | 'sphere' | 'torus' | 'crystal' | 'sketchfab';
export type ProfileType = 'fan' | 'artist' | 'collaborator' | 'admin';

export interface ExtendedDatabase {
  public: {
    Tables: {
      models: {
        Row: {
          id: string;
          name: string;
          model_type: ModelType;
          url: string | null;
          thumbnail_url: string | null;
          is_active: boolean | null;
          params: Json | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          model_type: ModelType;
          url?: string | null;
          thumbnail_url?: string | null;
          is_active?: boolean | null;
          params?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          model_type?: ModelType;
          url?: string | null;
          thumbnail_url?: string | null;
          is_active?: boolean | null;
          params?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          username: string | null;
          display_name: string | null;
          bio: string | null;
          avatar: string | null;
          cover_image: string | null;
          website: string | null;
          social_links: Json | null;
          preferences: Json | null;
          profile_type: ProfileType | null;
          is_verified: boolean | null;
          followers_count: number | null;
          following_count: number | null;
          created_at: string | null;
          updated_at: string | null;
          last_login: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          username?: string | null;
          display_name?: string | null;
          bio?: string | null;
          avatar?: string | null;
          cover_image?: string | null;
          website?: string | null;
          social_links?: Json | null;
          preferences?: Json | null;
          profile_type?: ProfileType | null;
          is_verified?: boolean | null;
          followers_count?: number | null;
          following_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          username?: string | null;
          display_name?: string | null;
          bio?: string | null;
          avatar?: string | null;
          cover_image?: string | null;
          website?: string | null;
          social_links?: Json | null;
          preferences?: Json | null;
          profile_type?: ProfileType | null;
          is_verified?: boolean | null;
          followers_count?: number | null;
          following_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          last_login?: string | null;
        };
      };
    };
    Functions: {
      count_followers: {
        Args: { user_id: string };
        Returns: number;
      };
      count_following: {
        Args: { user_id: string };
        Returns: number;
      };
      increment_like_count: {
        Args: { post_id: string };
        Returns: void;
      };
      decrement_like_count: {
        Args: { post_id: string };
        Returns: void;
      };
      increment_comment_count: {
        Args: { post_id: string };
        Returns: void;
      };
      log_auth_diagnostic: {
        Args: { message: string; metadata: Json };
        Returns: void;
      };
      // Add missing RPC functions that are being used in code
      is_following: {
        Args: { follower: string; following: string };
        Returns: boolean;
      };
      follow_user: {
        Args: { follower: string; following: string };
        Returns: void;
      };
      unfollow_user: {
        Args: { follower: string; following: string };
        Returns: void;
      };
      check_auth_connectivity: {
        Args: Record<string, never>;
        Returns: Json;
      };
      check_user_data: {
        Args: { user_id: string };
        Returns: Json;
      };
    };
  };
}

// Properly extend the Database type to add our extensions without duplicate declarations
declare global {
  namespace Supabase {
    interface Database extends ExtendedDatabase {}
  }
}

// Export model type for use in other files
export type SavedModel = ExtendedDatabase['public']['Tables']['models']['Row'];
