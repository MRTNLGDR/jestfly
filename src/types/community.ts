
import { Database } from "@/integrations/supabase/types";

export type CommunityPost = {
  id: string;
  title: string;
  content: string;
  category: 'announcement' | 'event' | 'discussion' | 'collaboration' | 'question';
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
