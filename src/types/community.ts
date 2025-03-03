
export interface User {
  username: string;
  display_name: string;
  avatar: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  is_pinned: boolean;
  is_featured: boolean;
  category: string;
  user: User;
}

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  post_id: string;
  created_at: string;
  likes_count: number;
  user: User;
}

export interface CommunityPost extends Post {
  user: User;
}

export type PostCategory = 'announcement' | 'event' | 'discussion' | 'collaboration' | 'question';
