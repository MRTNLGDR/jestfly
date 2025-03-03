
import React from 'react';
import PostCard from './PostCard';
import { Post } from '@/types/community';

interface PostsListProps {
  title: string;
  posts: Post[];
  onLike: (postId: string) => Promise<void>;
  className?: string;
  layout?: 'grid' | 'list';
  emptyMessage?: string;
}

const PostsList: React.FC<PostsListProps> = ({ 
  title, 
  posts, 
  onLike, 
  className = "", 
  layout = 'list',
  emptyMessage = "Nenhuma publicação encontrada"
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">{title}</h2>
      
      {posts.length === 0 ? (
        <div className="text-center p-8 bg-black/20 rounded-lg">
          <p className="text-white/60">{emptyMessage}</p>
        </div>
      ) : (
        <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
          {posts.map(post => (
            <PostCard key={post.id} post={post} onLike={onLike} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostsList;
