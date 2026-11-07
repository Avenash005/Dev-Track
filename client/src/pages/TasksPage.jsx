import React, { useState, useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Check,
  Calendar,
  Edit2,
  Trash2,
  FolderKanban,
  AlertCircle,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import TaskForm from '../components/tasks/TaskForm';

const STATUS_FILTERS = ['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'];
const PRIORITY_FILTERS = ['ALL', 'HIGH', 'MEDIUM', 'LOW'];

const PRIORITY_CONFIG = {
  HIGH: { label: 'High', variant: 'danger' },
  MEDIUM: { label: 'Medium', variant: 'warning' },
  LOW: { label: 'Low', variant: 'neutral' },
};

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', variant: 'neutral' },
  IN_PROGRESS: { label: 'In Progress', variant: 'primary' },
  COMPLETED: { label: 'Completed', variant: 'success' },
};

export default function TasksPage() {
  const { tasks, projects, addTask, updateTask, deleteTask, toggleTaskStatus } = useData();
  const outletContext = useOutletContext();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [localSearch, setLocalSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const activeSearch = outletContext?.searchQuery || localSearch;

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
      const matchesSearch =
        task.title.toLowerCase().includes(activeSearch.toLowerCase()) ||
        task.description?.toLowerCase().includes(activeSearch.toLowerCase());
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [tasks, statusFilter, priorityFilter, activeSearch]);

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleUpdate = (data) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
      setEditingTask(null);
    }
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteTask(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">Tasks</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Organize, prioritize, and complete engineering tasks across your repositories.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary-hover transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-text-muted uppercase mr-1">Status:</span>
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                statusFilter === status
                  ? 'bg-zinc-800 text-text-primary border border-zinc-700'
                  : 'text-text-muted hover:bg-zinc-900 hover:text-text-secondary'
              }`}
            >
              {status === 'ALL' ? 'All' : STATUS_CONFIG[status]?.label || status}
            </button>
          ))}
        </div>

        {/* Priority filter and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-text-muted uppercase">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg border border-border bg-zinc-900 px-2.5 py-1 text-xs text-text-primary focus:border-primary focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filter tasks..."
              className="w-full rounded-lg border border-border bg-zinc-900/80 py-1 pl-8 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks match your filters"
          description="Try selecting different status or priority criteria, or create a new task."
          actionLabel="Create Task"
          onAction={() => setIsCreateOpen(true)}
        />
      ) : (
        <div className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
          {filteredTasks.map((task) => {
            const isDone = task.status === 'COMPLETED';
            const priorityInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MEDIUM;
            const project = projects.find((p) => p.id === task.projectId);

            return (
              <div
                key={task.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 transition hover:bg-zinc-900/50"
              >
                <div className="flex items-start gap-3 overflow-hidden">
                  {/* Status checkbox */}
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                      isDone
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                        : 'border-zinc-700 bg-zinc-900 hover:border-primary'
                    }`}
                  >
                    {isDone && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </button>

                  <div className="space-y-1 overflow-hidden">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs font-medium ${
                          isDone ? 'text-text-muted line-through' : 'text-text-primary'
                        }`}
                      >
                        {task.title}
                      </span>
                      {project && (
                        <Link
                          to={`/projects/${project.id}`}
                          className="inline-flex items-center gap-1 rounded bg-zinc-900 border border-border px-1.5 py-0.5 text-[10px] text-text-muted hover:text-primary transition"
                        >
                          <FolderKanban className="h-2.5 w-2.5" />
                          <span>{project.title}</span>
                        </Link>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-[11px] text-text-muted line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t border-border sm:border-0">
                  <Badge variant={priorityInfo.variant} size="sm">
                    {priorityInfo.label}
                  </Badge>

                  {task.dueDate && (
                    <span className="flex items-center gap-1 text-[11px] text-text-muted">
                      <Calendar className="h-3 w-3" />
                      {task.dueDate}
                    </span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(task)}
                      title="Edit Task"
                      className="rounded p-1.5 text-text-muted hover:bg-zinc-800 hover:text-text-primary transition"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingId(task.id)}
                      title="Delete Task"
                      className="rounded p-1.5 text-text-muted hover:bg-zinc-800 hover:text-rose-400 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Task"
        subtitle="Add a task with deadline, priority, and project link."
      >
        <TaskForm
          onSubmit={(data) => {
            addTask(data);
            setIsCreateOpen(false);
          }}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
        subtitle="Modify task status, priority, or deadline."
      >
        {editingTask && (
          <TaskForm
            initialData={editingTask}
            onSubmit={handleUpdate}
            onCancel={() => setEditingTask(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Confirm Task Deletion"
        subtitle="Are you sure you want to delete this task?"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-text-secondary">
            This action cannot be undone. The task record will be removed from your project tracking.
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
              Delete Task
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
