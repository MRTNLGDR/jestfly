
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'purple' | 'blue';
  animated?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, variant = 'default', animated = false, ...props }, ref) => {
    const cardContent = (
      <div
        ref={ref}
        className={cn(
          'rounded-lg backdrop-blur-md border shadow-lg p-6 transition-all duration-300',
          variant === 'default' && 'bg-black/40 border-white/10 hover:bg-black/50 hover:border-white/20',
          variant === 'purple' && 'bg-purple-950/30 border-purple-500/20 hover:bg-purple-950/40 hover:border-purple-500/30',
          variant === 'blue' && 'bg-blue-950/30 border-blue-500/20 hover:bg-blue-950/40 hover:border-blue-500/30',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );

    if (animated) {
      return (
        <motion.div
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.3)"
          }}
          transition={{ 
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        >
          {cardContent}
        </motion.div>
      );
    }

    return cardContent;
  }
);

GlassCard.displayName = 'GlassCard';

export { GlassCard };
