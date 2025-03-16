
import { Database as OriginalDatabase } from './types';

/**
 * This file extends the Supabase types without modifying the original types.ts file
 */
export interface ExtendedDatabase extends OriginalDatabase {
  public: {
    Tables: {
      models: {
        Row: {
          id: string;
          name: string;
          model_type: 'diamond' | 'sphere' | 'torus' | 'crystal' | 'sketchfab';
          url: string | null;
          thumbnail_url: string | null;
          is_active: boolean | null;
          params: any | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          model_type: 'diamond' | 'sphere' | 'torus' | 'crystal' | 'sketchfab';
          url?: string | null;
          thumbnail_url?: string | null;
          is_active?: boolean | null;
          params?: any | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          model_type?: 'diamond' | 'sphere' | 'torus' | 'crystal' | 'sketchfab';
          url?: string | null;
          thumbnail_url?: string | null;
          is_active?: boolean | null;
          params?: any | null;
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
          social_links: any | null;
          preferences: any | null;
          profile_type: string | null;
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
          social_links?: any | null;
          preferences?: any | null;
          profile_type?: string | null;
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
          social_links?: any | null;
          preferences?: any | null;
          profile_type?: string | null;
          is_verified?: boolean | null;
          followers_count?: number | null;
          following_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          last_login?: string | null;
        };
      };
      community_posts: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          content: string | null;
          category: string | null;
          likes_count: number | null;
          comments_count: number | null;
          is_pinned: boolean | null;
          is_featured: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          content?: string | null;
          category?: string | null;
          likes_count?: number | null;
          comments_count?: number | null;
          is_pinned?: boolean | null;
          is_featured?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          content?: string | null;
          category?: string | null;
          likes_count?: number | null;
          comments_count?: number | null;
          is_pinned?: boolean | null;
          is_featured?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      post_comments: {
        Row: {
          id: string;
          post_id: string | null;
          user_id: string | null;
          content: string;
          likes_count: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          post_id?: string | null;
          user_id?: string | null;
          content: string;
          likes_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          post_id?: string | null;
          user_id?: string | null;
          content?: string;
          likes_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      post_likes: {
        Row: {
          id: string;
          post_id: string | null;
          user_id: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          post_id?: string | null;
          user_id?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          post_id?: string | null;
          user_id?: string | null;
          created_at?: string | null;
        };
      };
      user_follows: {
        Row: {
          id: string;
          follower_id: string | null;
          following_id: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          follower_id?: string | null;
          following_id?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          follower_id?: string | null;
          following_id?: string | null;
          created_at?: string | null;
        };
      };
      notes: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          content: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          content?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          content?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      diagnostic_logs: {
        Row: {
          id: string;
          message: string;
          metadata: any | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          message: string;
          metadata?: any | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          message?: string;
          metadata?: any | null;
          created_at?: string | null;
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
        Args: { message: string; metadata: any };
        Returns: void;
      };
    };
    Enums: {
      model_type: 'diamond' | 'sphere' | 'torus' | 'crystal' | 'sketchfab';
    };
  };
}

// Extending the original Database type to include our schema
declare module '@/integrations/supabase/types' {
  interface Database extends ExtendedDatabase {}
}
