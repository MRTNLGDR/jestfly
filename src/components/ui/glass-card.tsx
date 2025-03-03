
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'purple' | 'blue';
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg backdrop-blur-md border shadow-lg p-6',
          variant === 'default' && 'bg-black/40 border-white/10',
          variant === 'purple' && 'bg-purple-950/30 border-purple-500/20',
          variant === 'blue' && 'bg-blue-950/30 border-blue-500/20',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export { GlassCard };
