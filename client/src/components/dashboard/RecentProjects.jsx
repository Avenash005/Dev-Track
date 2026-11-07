import React from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, ArrowRight, CheckCircle2 } from 'lucide-react';
import Badge from '../common/Badge';
import EmptyState from '../common/EmptyState';

const STATUS_VARIANTS = {
  PLANNING: { label: 'Planning', variant: 'warning' },
  IN_PROGRESS: { label: 'In Progress', variant: 'primary' },
  COMPLETED: { label: 'Completed', variant: 'success' },
  ON_HOLD: { label: 'On Hold', variant: 'neutral' },
};

export default function RecentProjects({ projects, tasks, onNewProject }) {
  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="No projects yet"
        description="Create your first software development project to track tasks and milestones."
        actionLabel="Create Project"
        onAction={onNewProject}
      />
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-text-primary">Recent Projects</h3>
        </div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-light transition"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-border">
        {projects.slice(0, 3).map((project) => {
          const projectTasks = tasks.filter((t) => t.projectId === project.id);
          const completedCount = projectTasks.filter((t) => t.status === 'COMPLETED').length;
          const progress =
            projectTasks.length > 0
              ? Math.round((completedCount / projectTasks.length) * 100)
              : 0;
          const statusInfo = STATUS_VARIANTS[project.status] || STATUS_VARIANTS.PLANNING;

          return (
            <div
              key={project.id}
              className="py-3.5 first:pt-3.5 last:pb-1 group flex flex-col gap-2.5 transition hover:bg-zinc-900/40 -mx-2 px-2 rounded-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <Link
                    to={`/projects/${project.id}`}
                    className="text-xs font-semibold text-text-primary group-hover:text-primary transition"
                  >
                    {project.title}
                  </Link>
                  <p className="text-[11px] text-text-muted line-clamp-1">
                    {project.description}
                  </p>
                </div>
                <Badge variant={statusInfo.variant} size="sm">
                  {statusInfo.label}
                </Badge>
              </div>

              {/* Progress and task count bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-text-muted">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-text-muted" />
                    {completedCount} / {projectTasks.length} tasks completed
                  </span>
                  <span className="font-medium text-text-secondary">{progress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

