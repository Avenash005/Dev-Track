import React from 'react';

export default function LoadingSpinner({
  size = 'md',
  message = 'Loading...',
  fullScreen = false,
}) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`animate-spin rounded-full border-zinc-700 border-t-primary ${
          sizeClasses[size] || sizeClasses.md
        }`}
      />
      {message && <p className="text-xs text-text-muted">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return <div className="flex w-full items-center justify-center p-8">{content}</div>;
}
