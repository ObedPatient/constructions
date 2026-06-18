import type { ReactNode } from 'react';

type BadgeVariant = 'accent' | 'success' | 'warning' | 'info' | 'neutral' | 'danger';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  accent: 'bg-accent text-white',
  success: 'bg-accent text-white',
  warning: 'bg-secondary text-white',
  info: 'bg-accent/90 text-white',
  neutral: 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white/70',
  danger: 'bg-red-500 text-white',
};

export default function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
