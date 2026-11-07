import React from 'react';

const variantClasses = {
  default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  primary: 'bg-primary/10 text-primary-light border-primary/30',
  secondary: 'bg-secondary/10 text-secondary-light border-secondary/30',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  danger: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  neutral: 'bg-zinc-900 text-text-secondary border-border',
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs font-medium px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
  dotColor = '',
}) {
  const chosenVariant = variantClasses[variant] || variantClasses.default;
  const chosenSize = sizeClasses[size] || sizeClasses.md;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${chosenVariant} ${chosenSize} transition-colors ${className}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            dotColor || (variant === 'success' ? 'bg-emerald-400' : 'bg-primary')
          }`}
        />
      )}
      {children}
    </span>
  );
}
