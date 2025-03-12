
import React, { useEffect, useState } from 'react';
import { fetchUserPosts } from '../../services/profileService';
import { Post } from '../../models/Post';
import PostCard from '../community/PostCard';
import { useNavigate } from 'react-router-dom';

interface ProfilePostsProps {
  userId: string;
}

const ProfilePosts: React.FC<ProfilePostsProps> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        const postsData = await fetchUserPosts(userId);
        setPosts(postsData);
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [userId]);

  const handleCommentClick = (postId: string) => {
    navigate(`/community?post=${postId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin h-12 w-12 border-4 border-t-purple-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="neo-blur rounded-xl border border-white/10 p-8 text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Nenhum post ainda</h3>
        <p className="text-white/60">
          Este usuário ainda não publicou nenhum conteúdo.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onCommentClick={handleCommentClick}
        />
      ))}
    </div>
  );
};

export default ProfilePosts;
