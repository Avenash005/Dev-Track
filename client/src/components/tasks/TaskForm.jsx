import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

export default function TaskForm({ initialData, defaultProjectId, onSubmit, onCancel }) {
  const { projects } = useData();

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [projectId, setProjectId] = useState(
    initialData?.projectId || defaultProjectId || (projects[0]?.id || '')
  );
  const [status, setStatus] = useState(initialData?.status || 'PENDING');
  const [priority, setPriority] = useState(initialData?.priority || 'MEDIUM');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    if (!projectId) {
      setError('Please select an associated project');
      return;
    }
    setError('');
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      projectId,
      status,
      priority,
      dueDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-400">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">
          Task Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Implement Prisma schema relations"
          className="w-full rounded-lg border border-border bg-zinc-900 px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">
          Associated Project *
        </label>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="w-full rounded-lg border border-border bg-zinc-900 px-3 py-2 text-xs text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">
          Description
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add implementation notes or checklist items..."
          className="w-full rounded-lg border border-border bg-zinc-900 px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-border bg-zinc-900 px-3 py-2 text-xs text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full rounded-lg border border-border bg-zinc-900 px-3 py-2 text-xs text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-lg border border-border bg-zinc-900 px-3 py-2 text-xs text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border px-3.5 py-1.5 text-xs font-medium text-text-secondary hover:bg-zinc-800 hover:text-text-primary transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-primary-hover transition active:scale-95"
        >
          {initialData ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
