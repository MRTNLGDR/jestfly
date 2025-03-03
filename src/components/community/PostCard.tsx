
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CategoryIcon, { formatCategoryName } from './CategoryIcon';
import { Post } from '@/types/community';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => Promise<void>;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  return (
    <Card key={post.id} className="bg-black/40 backdrop-blur-md border-white/10 hover:border-purple-500 transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <CategoryIcon category={post.category} />
            <span className="text-sm text-white/70">{formatCategoryName(post.category)}</span>
          </div>
          {post.is_pinned && (
            <div className="bg-yellow-900/60 text-yellow-200 px-2 py-0.5 rounded-full text-xs">
              Fixado
            </div>
          )}
        </div>
        <CardTitle className="text-xl text-white">{post.title}</CardTitle>
        <CardDescription className="text-white/60">
          Por {post.user?.display_name || 'Usuário'} • {formatDistanceToNow(new Date(post.created_at), { locale: ptBR, addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-white/80 line-clamp-3">{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t border-white/10">
        <div className="flex space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => onLike(post.id)}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span>{post.likes_count}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/70 hover:text-white hover:bg-white/10"
            asChild
          >
            <Link to={`/community/post/${post.id}`}>
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{post.comments_count}</span>
            </Link>
          </Button>
        </div>
        <Button 
          variant="ghost" 
          className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
          asChild
        >
          <Link to={`/community/post/${post.id}`}>Ver mais</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
