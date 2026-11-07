import React from 'react';
import { FolderKanban, Plus } from 'lucide-react';

export default function EmptyState({
  icon: Icon = FolderKanban,
  title = 'No items found',
  description = 'Get started by creating your first entry.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 p-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-zinc-900 text-text-muted">
        <Icon className="h-6 w-6 text-text-secondary" />
      </div>
      <h4 className="text-base font-semibold text-text-primary">{title}</h4>
      <p className="mt-1 max-w-sm text-xs text-text-muted">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-primary-hover active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
