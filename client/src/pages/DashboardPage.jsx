import React, { useState } from 'react';
import {
  FolderKanban,
  CheckSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import StatCard from '../components/common/StatCard';
import QuickActions from '../components/dashboard/QuickActions';
import RecentProjects from '../components/dashboard/RecentProjects';
import UpcomingTasks from '../components/dashboard/UpcomingTasks';
import RecentActivity from '../components/dashboard/RecentActivity';
import Modal from '../components/common/Modal';
import ProjectForm from '../components/projects/ProjectForm';
import TaskForm from '../components/tasks/TaskForm';

export default function DashboardPage() {
  const { user } = useAuth();
  const { projects, tasks, activities, stats, addProject, addTask, toggleTaskStatus } = useData();

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* 1. Welcome Message & Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-card via-zinc-900 to-card p-6 sm:p-8">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary-light">
                <Sparkles className="h-3 w-3" />
                DevTrack AI v1.0
              </span>
              <span className="text-xs text-text-muted">Academic Term 2026</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Welcome back, {user?.name || 'Developer'}!
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm text-text-secondary">
              Track your development milestones, test local AI models with Ollama, and master core JavaScript runtime mechanics in one unified workspace.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-border bg-zinc-900/80 p-3 text-right">
              <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                Velocity Score
              </p>
              <div className="flex items-center justify-end gap-1.5 text-emerald-400 font-bold text-lg">
                <TrendingUp className="h-4 w-4" />
                <span>{stats.completionRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-6. Stat Cards: Total Projects, Total Tasks, Completed Tasks, Pending Tasks, Completion % */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={FolderKanban}
          accent="primary"
          subtitle="Active repositories & modules"
        />
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={CheckSquare}
          accent="secondary"
          subtitle="Tracked action items"
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          icon={CheckCircle2}
          accent="success"
          subtitle={`${stats.completionRate}% total completion rate`}
          progress={stats.completionRate}
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon={Clock}
          accent="warning"
          subtitle="Remaining milestone work"
        />
      </div>

      {/* 10. Quick Action Buttons */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Quick Actions
        </h3>
        <QuickActions
          onNewProject={() => setIsProjectModalOpen(true)}
          onNewTask={() => setIsTaskModalOpen(true)}
        />
      </div>

      {/* 7, 8. Recent Projects and Upcoming Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProjects
          projects={projects}
          tasks={tasks}
          onNewProject={() => setIsProjectModalOpen(true)}
        />
        <UpcomingTasks
          tasks={tasks}
          onToggleStatus={toggleTaskStatus}
          onNewTask={() => setIsTaskModalOpen(true)}
        />
      </div>

      {/* 9. Recent Activity Timeline */}
      <div className="grid grid-cols-1 gap-6">
        <RecentActivity activities={activities} />
      </div>

      {/* Modals */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Create New Project"
        subtitle="Initialize a new project to group tasks and review progress."
      >
        <ProjectForm
          onSubmit={(data) => {
            addProject(data);
            setIsProjectModalOpen(false);
          }}
          onCancel={() => setIsProjectModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Create New Task"
        subtitle="Add a task with deadline, priority, and project link."
      >
        <TaskForm
          onSubmit={(data) => {
            addTask(data);
            setIsTaskModalOpen(false);
          }}
          onCancel={() => setIsTaskModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

