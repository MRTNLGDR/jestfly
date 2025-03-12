
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
