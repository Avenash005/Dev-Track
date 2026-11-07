import React, { useState, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import ProjectForm from '../components/projects/ProjectForm';

const STATUS_OPTIONS = ['ALL', 'PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD'];

const STATUS_CONFIG = {
  PLANNING: { label: 'Planning', variant: 'warning' },
  IN_PROGRESS: { label: 'In Progress', variant: 'primary' },
  COMPLETED: { label: 'Completed', variant: 'success' },
  ON_HOLD: { label: 'On Hold', variant: 'neutral' },
};

export default function ProjectsPage() {
  const { projects, tasks, addProject, updateProject, deleteProject } = useData();
  const outletContext = useOutletContext();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [localSearch, setLocalSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const activeSearch = outletContext?.searchQuery || localSearch;

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
      const matchesSearch =
        project.title.toLowerCase().includes(activeSearch.toLowerCase()) ||
        project.description?.toLowerCase().includes(activeSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [projects, statusFilter, activeSearch]);

  const handleEdit = (project) => {
    setEditingProject(project);
  };

  const handleUpdate = (data) => {
    if (editingProject) {
      updateProject(editingProject.id, data);
      setEditingProject(null);
    }
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteProject(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">Projects</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage your engineering repositories, milestones, and task distributions.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary-hover transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
        {/* Status filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                statusFilter === status
                  ? 'bg-zinc-800 text-text-primary border border-zinc-700'
                  : 'text-text-muted hover:bg-zinc-900 hover:text-text-secondary'
              }`}
            >
              {status === 'ALL' ? 'All Projects' : STATUS_CONFIG[status]?.label || status}
            </button>
          ))}
        </div>

        {/* Local Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Filter projects..."
            className="w-full rounded-lg border border-border bg-zinc-900/80 py-1.5 pl-8 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects match criteria"
          description="Try adjusting your status filter or search query, or create a brand new project."
          actionLabel="Create Project"
          onAction={() => setIsCreateOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => {
            const projectTasks = tasks.filter((t) => t.projectId === project.id);
            const completedCount = projectTasks.filter((t) => t.status === 'COMPLETED').length;
            const progress =
              projectTasks.length > 0
                ? Math.round((completedCount / projectTasks.length) * 100)
                : 0;
            const statusInfo = STATUS_CONFIG[project.status] || STATUS_CONFIG.PLANNING;

            return (
              <div
                key={project.id}
                className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/20"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant={statusInfo.variant} size="sm">
                      {statusInfo.label}
                    </Badge>
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleEdit(project)}
                        title="Edit Project"
                        className="rounded p-1 text-text-muted hover:bg-zinc-800 hover:text-text-primary"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingId(project.id)}
                        title="Delete Project"
                        className="rounded p-1 text-text-muted hover:bg-zinc-800 hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <Link to={`/projects/${project.id}`} className="mt-3 block group-hover:text-primary transition">
                    <h3 className="text-sm font-semibold text-text-primary">{project.title}</h3>
                  </Link>

                  <p className="mt-1 text-xs text-text-muted line-clamp-2">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-5 space-y-3 pt-3 border-t border-border">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {completedCount} / {projectTasks.length} tasks
                      </span>
                      <span className="font-medium text-text-primary">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/projects/${project.id}`}
                      className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary-light"
                    >
                      View Tasks
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Project"
        subtitle="Define project requirements, architecture scope, and roadmap."
      >
        <ProjectForm
          onSubmit={(data) => {
            addProject(data);
            setIsCreateOpen(false);
          }}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        title="Edit Project"
        subtitle="Update project metadata, status, and description."
      >
        {editingProject && (
          <ProjectForm
            initialData={editingProject}
            onSubmit={handleUpdate}
            onCancel={() => setEditingProject(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Confirm Project Deletion"
        subtitle="Are you sure you want to delete this project and all its associated tasks?"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-text-secondary">
            This action cannot be undone. All tasks mapped to this project will be permanently removed.
          </p>
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              onClick={() => setDeletingId(null)}
              className="rounded-lg border border-border px-3.5 py-1.5 text-xs font-medium text-text-secondary hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-rose-700 transition"
            >
              Delete Project
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
