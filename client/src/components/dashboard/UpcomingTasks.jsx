import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, ArrowRight, Calendar, Check } from 'lucide-react';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';

const PRIORITY_VARIANTS = {
  HIGH: { label: 'High', variant: 'danger' },
  MEDIUM: { label: 'Medium', variant: 'warning' },
  LOW: { label: 'Low', variant: 'neutral' },
};

export default function UpcomingTasks({ tasks, onToggleStatus, onNewTask }) {
  const pendingTasks = tasks.filter((t) => t.status !== 'COMPLETED');

  if (!pendingTasks || pendingTasks.length === 0) {
    return (
      <EmptyState
        icon={CheckSquare}
        title="All caught up!"
        description="No pending tasks. You have achieved 100% completion on all active items."
        actionLabel="Create Task"
        onAction={onNewTask}
      />
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-secondary" />
          <h3 className="text-sm font-semibold text-text-primary">Upcoming Tasks</h3>
        </div>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-1 text-xs font-medium text-secondary hover:text-secondary-light transition"
        >
          View all ({pendingTasks.length})
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-border">
        {pendingTasks.slice(0, 4).map((task) => {
          const priorityInfo = PRIORITY_VARIANTS[task.priority] || PRIORITY_VARIANTS.MEDIUM;
          const isDone = task.status === 'COMPLETED';

          return (
            <div
              key={task.id}
              className="py-3 first:pt-3.5 last:pb-1 flex items-center justify-between gap-3 group transition -mx-2 px-2 rounded-lg hover:bg-zinc-900/40"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                {/* Status toggle checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleStatus(task.id)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                    isDone
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                      : 'border-zinc-700 bg-zinc-900 hover:border-primary'
                  }`}
                >
                  {isDone && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </button>

                <div className="overflow-hidden">
                  <p
                    className={`truncate text-xs font-medium transition ${
                      isDone
                        ? 'text-text-muted line-through'
                        : 'text-text-primary group-hover:text-secondary-light'
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-[11px] text-text-muted mt-0.5">
                      <Calendar className="h-3 w-3" />
                      <span>Due {task.dueDate}</span>
                    </div>
                  )}
                </div>
              </div>

              <Badge variant={priorityInfo.variant} size="sm">
                {priorityInfo.label}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}

