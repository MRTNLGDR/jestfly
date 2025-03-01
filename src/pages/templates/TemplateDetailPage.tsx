
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TemplateDetailPage: React.FC = () => {
  const { category } = useParams();
  
  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <Link to="/templates" className="flex items-center text-white/70 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Resources
        </Link>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
          {category?.charAt(0).toUpperCase() + category?.slice(1)} Resources
        </h1>
        
        <div className="glass-morphism p-8 rounded-xl">
          <p className="text-xl text-white/70">
            This is a placeholder for the {category} resources page. 
            More content will be added here soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetailPage;
