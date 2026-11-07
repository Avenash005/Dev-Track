import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FolderKanban,
  CheckCircle2,
  Clock,
  Plus,
  Calendar,
  Trash2,
  Edit2,
  Check,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import TaskForm from '../components/tasks/TaskForm';
import ProjectForm from '../components/projects/ProjectForm';

const STATUS_CONFIG = {
  PLANNING: { label: 'Planning', variant: 'warning' },
  IN_PROGRESS: { label: 'In Progress', variant: 'primary' },
  COMPLETED: { label: 'Completed', variant: 'success' },
  ON_HOLD: { label: 'On Hold', variant: 'neutral' },
};

const PRIORITY_VARIANTS = {
  HIGH: { label: 'High', variant: 'danger' },
  MEDIUM: { label: 'Medium', variant: 'warning' },
  LOW: { label: 'Low', variant: 'neutral' },
};

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, tasks, updateProject, deleteProject, addTask, toggleTaskStatus, deleteTask } = useData();

  const project = projects.find((p) => p.id === id);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);

  if (!project) {
    return (
      <div className="space-y-4">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
        <EmptyState
          icon={FolderKanban}
          title="Project not found"
          description={`No project was found matching the identifier "${id}".`}
          actionLabel="View All Projects"
          onAction={() => navigate('/projects')}
        />
      </div>
    );
  }

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const completedTasks = projectTasks.filter((t) => t.status === 'COMPLETED');
  const progress =
    projectTasks.length > 0 ? Math.round((completedTasks.length / projectTasks.length) * 100) : 0;
  const statusInfo = STATUS_CONFIG[project.status] || STATUS_CONFIG.PLANNING;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
      </div>

      {/* Project Overview Card */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={statusInfo.variant} size="md">
                {statusInfo.label}
              </Badge>
              <span className="text-xs text-text-muted flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Created {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              {project.title}
            </h1>
            <p className="max-w-3xl text-xs sm:text-sm text-text-secondary leading-relaxed">
              {project.description || 'No detailed description provided.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsEditProjectOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-zinc-900 px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-zinc-800 hover:text-text-primary"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              onClick={() => {
                if (confirm('Delete this project?')) {
                  deleteProject(project.id);
                  navigate('/projects');
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/20"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>

        {/* Progress summary banner */}
        <div className="mt-6 rounded-xl border border-border bg-zinc-900/60 p-4">
          <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
            <span className="font-medium text-text-primary">Project Completion</span>
            <span className="font-semibold text-primary">{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              {completedTasks.length} Completed
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              {projectTasks.length - completedTasks.length} Pending
            </span>
          </div>
        </div>
      </div>

      {/* Associated Tasks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-text-primary">Associated Tasks</h2>
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-text-muted">
              {projectTasks.length}
            </span>
          </div>
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-primary-hover"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Task
          </button>
        </div>

        {projectTasks.length === 0 ? (
          <EmptyState
            title="No tasks in this project"
            description="Add tasks to break down this project into actionable engineering milestones."
            actionLabel="Add First Task"
            onAction={() => setIsTaskModalOpen(true)}
          />
        ) : (
          <div className="space-y-2">
            {projectTasks.map((task) => {
              const isDone = task.status === 'COMPLETED';
              const priorityInfo = PRIORITY_VARIANTS[task.priority] || PRIORITY_VARIANTS.MEDIUM;

              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-zinc-700"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                        isDone
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                          : 'border-zinc-700 bg-zinc-900 hover:border-primary'
                      }`}
                    >
                      {isDone && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </button>
                    <div>
                      <p
                        className={`text-xs font-medium ${
                          isDone ? 'text-text-muted line-through' : 'text-text-primary'
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-[11px] text-text-muted line-clamp-1 mt-0.5">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={priorityInfo.variant} size="sm">
                      {priorityInfo.label}
                    </Badge>
                    {task.dueDate && (
                      <span className="hidden sm:inline text-xs text-text-muted">
                        Due {task.dueDate}
                      </span>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="rounded p-1 text-text-muted hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Task Creation Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Add Task to Project"
        subtitle={`Create task for "${project.title}"`}
      >
        <TaskForm
          defaultProjectId={project.id}
          onSubmit={(data) => {
            addTask(data);
            setIsTaskModalOpen(false);
          }}
          onCancel={() => setIsTaskModalOpen(false)}
        />
      </Modal>

      {/* Project Edit Modal */}
      <Modal
        isOpen={isEditProjectOpen}
        onClose={() => setIsEditProjectOpen(false)}
        title="Edit Project"
        subtitle="Modify title, description, or project workflow status."
      >
        <ProjectForm
          initialData={project}
          onSubmit={(data) => {
            updateProject(project.id, data);
            setIsEditProjectOpen(false);
          }}
          onCancel={() => setIsEditProjectOpen(false)}
        />
      </Modal>
    </div>
  );
}

