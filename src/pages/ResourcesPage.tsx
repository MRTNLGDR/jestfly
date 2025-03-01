import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Box, Layers, Palette, Image, Video, Package, Brush } from 'lucide-react';
import NFTModel from '../components/NFTModel';

const ResourcesPage: React.FC = () => {
  // Define the resource categories
  const resources = [
    {
      title: '3D Models',
      description: 'Premium 3D models for your creative projects',
      icon: <Box className="h-10 w-10 text-purple-500" />,
      modelType: '001',
      bgColor: 'from-purple-900/20 to-indigo-900/30',
      link: '/templates/models'
    },
    {
      title: 'Design Templates',
      description: 'Ready-to-use templates for faster creation',
      icon: <Layers className="h-10 w-10 text-blue-500" />,
      modelType: '002',
      bgColor: 'from-blue-900/20 to-cyan-900/30',
      link: '/templates/design'
    },
    {
      title: 'Color Palettes',
      description: 'Curated color schemes for your projects',
      icon: <Palette className="h-10 w-10 text-green-500" />,
      modelType: '003',
      bgColor: 'from-green-900/20 to-emerald-900/30',
      link: '/templates/colors'
    },
    {
      title: 'Texture Packs',
      description: 'High-quality textures for 3D modeling',
      icon: <Image className="h-10 w-10 text-pink-500" />,
      modelType: '001',
      bgColor: 'from-pink-900/20 to-rose-900/30',
      link: '/templates/textures'
    },
    {
      title: 'Video Tutorials',
      description: 'Learn from expert creators and designers',
      icon: <Video className="h-10 w-10 text-amber-500" />,
      modelType: '002',
      bgColor: 'from-amber-900/20 to-orange-900/30',
      link: '/templates/tutorials'
    },
    {
      title: 'Asset Bundles',
      description: 'Complete packages for specific projects',
      icon: <Package className="h-10 w-10 text-red-500" />,
      modelType: '003',
      bgColor: 'from-red-900/20 to-rose-900/30',
      link: '/templates/bundles'
    },
    {
      title: 'Design Tools',
      description: 'Software and tools for 3D creation',
      icon: <Brush className="h-10 w-10 text-violet-500" />,
      modelType: '001',
      bgColor: 'from-violet-900/20 to-purple-900/30',
      link: '/templates/tools'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero section */}
      <div className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
            Creative Resources
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-2xl">
            Discover premium 3D assets, templates, and tools to elevate your digital creations and NFT projects.
          </p>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/10 rounded-full filter blur-3xl"></div>
      </div>

      {/* Resources grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <ResourceCard key={index} resource={resource} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Resource card component with hover animation
interface ResourceCardProps {
  resource: {
    title: string;
    description: string;
    icon: JSX.Element;
    modelType: string;
    bgColor: string;
    link: string;
  };
  index: number;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      className={`relative rounded-xl overflow-hidden h-80 group cursor-pointer`}
    >
      <Link to={resource.link} className="block h-full">
        {/* Card background with gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${resource.bgColor}`}></div>
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10"></div>
        
        {/* Content container */}
        <div className="relative h-full p-6 flex flex-col">
          <div className="mb-4">{resource.icon}</div>
          <h3 className="text-2xl font-bold mb-2">{resource.title}</h3>
          <p className="text-white/70 mb-6">{resource.description}</p>
          
          {/* 3D Model visualization area */}
          <div className="flex-grow relative overflow-hidden rounded-lg bg-black/30">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <NFTModel modelType={resource.modelType} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
              <p className="text-white/50 text-sm">Hover to preview</p>
            </div>
          </div>
          
          {/* Hover effect button */}
          <motion.div 
            className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ opacity: 0 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm font-medium">Explore</span>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ResourcesPage;
