import React from 'react';
import { Activity, CheckCircle, FolderPlus, Bot, Clock } from 'lucide-react';

export default function RecentActivity({ activities }) {
  const getIcon = (type) => {
    switch (type) {
      case 'TASK_COMPLETED':
        return <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />;
      case 'PROJECT_CREATED':
        return <FolderPlus className="h-3.5 w-3.5 text-primary" />;
      case 'AI_QUERY':
        return <Bot className="h-3.5 w-3.5 text-secondary" />;
      default:
        return <Activity className="h-3.5 w-3.5 text-text-muted" />;
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 pb-4 border-b border-border">
        <Activity className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-text-primary">Recent Activity</h3>
      </div>

      <div className="mt-4 space-y-4">
        {activities.slice(0, 5).map((act) => (
          <div key={act.id} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-zinc-900">
              {getIcon(act.type)}
            </div>
            <div className="space-y-0.5 overflow-hidden">
              <p className="text-xs font-medium text-text-primary">{act.title}</p>
              <div className="flex items-center gap-2 text-[10px] text-text-muted">
                {act.project && <span>{act.project}</span>}
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5" />
                  {act.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

