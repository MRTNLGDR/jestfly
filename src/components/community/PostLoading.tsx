
import React from 'react';
import { Loader2 } from 'lucide-react';

const PostLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
    </div>
  );
};

export default PostLoading;
