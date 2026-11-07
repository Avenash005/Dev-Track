import React from 'react';

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendType = 'positive', // 'positive' | 'negative' | 'neutral'
  subtitle,
  progress, // number between 0 and 100
  accent = 'primary', // 'primary' | 'secondary' | 'success' | 'warning'
  onClick,
}) {
  const accentStyles = {
    primary: 'text-primary bg-primary/10 border-primary/20',
    secondary: 'text-secondary bg-secondary/10 border-secondary/20',
    success: 'text-success bg-success/10 border-success/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
  };

  const progressColors = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
  };

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/20 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-text-primary">
              {value}
            </h3>
            {trend && (
              <span
                className={`text-xs font-semibold ${
                  trendType === 'positive'
                    ? 'text-emerald-400'
                    : trendType === 'negative'
                    ? 'text-rose-400'
                    : 'text-text-muted'
                }`}
              >
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-text-muted">{subtitle}</p>
          )}
        </div>

        {Icon && (
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-lg border p-2.5 transition-transform duration-200 group-hover:scale-105 ${
              accentStyles[accent] || accentStyles.primary
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {typeof progress === 'number' && (
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Progress</span>
            <span className="font-medium text-text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                progressColors[accent] || 'bg-primary'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
