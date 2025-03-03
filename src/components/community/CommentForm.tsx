
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CommentFormProps {
  isLoggedIn: boolean;
  onSubmit: (content: string) => Promise<void>;
  isPending: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({ isLoggedIn, onSubmit, isPending }) => {
  const [commentContent, setCommentContent] = useState('');

  const handleSubmit = async () => {
    if (!commentContent.trim()) return;
    
    try {
      await onSubmit(commentContent);
      setCommentContent('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-black/30 p-4 rounded-lg mb-8">
        <p className="text-white/70">
          <Link to="/auth" className="text-purple-400 hover:underline">Faça login</Link> para participar da discussão
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <Textarea
        placeholder="Adicione um comentário..."
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        className="bg-black/30 border-white/10 text-white resize-none mb-2"
      />
      <Button 
        onClick={handleSubmit}
        disabled={!commentContent.trim() || isPending}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Enviando...
          </>
        ) : (
          'Comentar'
        )}
      </Button>
    </div>
  );
};

export default CommentForm;
