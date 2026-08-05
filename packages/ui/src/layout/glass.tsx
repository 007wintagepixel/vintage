// ============================================
// @ludo-nexus/ui - Layout Components
// ============================================

import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  strong?: boolean;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ 
    className, 
    strong = false, 
    hover = false, 
    padding = 'md',
    children, 
    ...props 
  }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl backdrop-blur-xl transition-all duration-300',
          strong
            ? 'bg-white/10 border border-cyan-400/30 shadow-[0_16px_48px_rgba(0,0,0,0.5)]'
            : 'bg-white/5 border border-slate-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
          hover && 'hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]',
          paddingClasses[padding],
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

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, padding = 'lg', children, ...props }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-3xl bg-white/15 backdrop-blur-2xl border border-cyan-400/30 shadow-[0_16px_48px_rgba(0,0,0,0.5)]',
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';

// Page Container
interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(
  ({ className, maxWidth = '7xl', children, ...props }, ref) => {
    const maxWidthClasses = {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      '2xl': 'max-w-[96rem]',
      full: 'max-w-full',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto px-4 sm:px-6 lg:px-8',
          maxWidthClasses[maxWidth],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PageContainer.displayName = 'PageContainer';

// Section Container
interface SectionContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}

export const SectionContainer = forwardRef<HTMLDivElement, SectionContainerProps>(
  ({ className, spacing = 'lg', children, ...props }, ref) => {
    const spacingClasses = {
      sm: 'py-8',
      md: 'py-12',
      lg: 'py-16',
      xl: 'py-24',
    };

    return (
      <div
        ref={ref}
        className={cn(spacingClasses[spacing], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SectionContainer.displayName = 'SectionContainer';