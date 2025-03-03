
import { Database } from "@/integrations/supabase/types";

// Definindo categoria como união de strings literal em vez de enum
export type PostCategory = 'announcement' | 'event' | 'discussion' | 'collaboration' | 'question';

export type CommunityPost = {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  likes_count: number;
  comments_count: number;
  is_pinned: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  user?: {
    username: string;
    avatar?: string;
    display_name: string;
  };
};

export type PostComment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  user?: {
    username: string;
    avatar?: string;
    display_name: string;
  };
};

export type PostLike = {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
};

export type CommentLike = {
  id: string;
  comment_id: string;
  user_id: string;
  created_at: string;
};

// Tipos relacionados às tabelas do Supabase para uso com tipagem genérica
export type TablesInsert = {
  community_posts: {
    title: string;
    content: string;
    category: PostCategory;
    user_id: string;
    is_pinned?: boolean;
    is_featured?: boolean;
  };
  post_comments: {
    post_id: string;
    user_id: string;
    content: string;
  };
  post_likes: {
    post_id: string;
    user_id: string;
  };
  comment_likes: {
    comment_id: string;
    user_id: string;
  };
};
