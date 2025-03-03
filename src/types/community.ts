
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

// Work around TypeScript issues by declaring our table types explicitly
export type CommunityPostsTable = Omit<CommunityPost, "user">;
export type PostCommentsTable = Omit<PostComment, "user">;
export type PostLikesTable = PostLike;
export type CommentLikesTable = CommentLike;

// Input types for creating new records
export type CreatePostInput = {
  title: string;
  content: string;
  category: PostCategory;
  user_id: string;
  is_pinned?: boolean;
  is_featured?: boolean;
};

export type CreateCommentInput = {
  post_id: string;
  user_id: string;
  content: string;
};

export type CreatePostLikeInput = {
  post_id: string;
  user_id: string;
};

export type CreateCommentLikeInput = {
  comment_id: string;
  user_id: string;
};
