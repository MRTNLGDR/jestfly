
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
  profiles?: {
    username: string;
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
  profiles?: {
    username: string;
    avatar: string | null;
  };
}
