import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderPlus, PlusCircle, Bot, GraduationCap } from 'lucide-react';

export default function QuickActions({ onNewProject, onNewTask }) {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'New Project',
      description: 'Initialize a new repository or course project',
      icon: FolderPlus,
      color: 'text-primary',
      bg: 'hover:border-primary/40',
      action: onNewProject,
    },
    {
      title: 'New Task',
      description: 'Add an action item with priority & deadline',
      icon: PlusCircle,
      color: 'text-secondary',
      bg: 'hover:border-secondary/40',
      action: onNewTask,
    },
    {
      title: 'Ask AI Assistant',
      description: 'Debug syntax or explore full-stack architecture',
      icon: Bot,
      color: 'text-emerald-400',
      bg: 'hover:border-emerald-500/40',
      action: () => navigate('/ai'),
    },
    {
      title: 'Practice Concepts',
      description: 'Experiment with Closures, Event Loop & Promises',
      icon: GraduationCap,
      color: 'text-amber-400',
      bg: 'hover:border-amber-500/40',
      action: () => navigate('/learn'),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <button
            key={act.title}
            onClick={act.action}
            className={`flex items-start gap-3.5 rounded-xl border border-border bg-card p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${act.bg}`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-900 border border-border">
              <Icon className={`h-5 w-5 ${act.color}`} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-primary">{act.title}</h4>
              <p className="mt-0.5 text-[11px] text-text-muted line-clamp-1">
                {act.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

