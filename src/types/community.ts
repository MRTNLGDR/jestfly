
export interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
  image_url?: string | null;
  likes_count?: number;
  comments_count?: number;
  category: string;
  is_pinned: boolean;
  is_featured: boolean;
  profiles?: {
    username: string;
    avatar: string | null;
  };
  user?: {
    display_name: string;
    avatar: string | null;
  };
}

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  post_id: string;
  created_at: string;
  updated_at?: string;
  likes_count?: number;
  profiles?: {
    username: string;
    avatar: string | null;
  };
  user?: {
    display_name: string;
    avatar: string | null;
  };
}

export type PostCategory = 'announcement' | 'event' | 'discussion' | 'collaboration' | 'question';

export interface CommunityPost extends Post {
  user: {
    username: string;
    display_name: string;
    avatar: string | null;
  };
}
