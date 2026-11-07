import React, { useState } from 'react';

export default function ProjectForm({ initialData, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState(initialData?.status || 'PLANNING');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Project title is required');
      return;
    }
    setError('');
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
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
          Project Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Distributed System Microservices"
          className="w-full rounded-lg border border-border bg-zinc-900 px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">
          Description
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the project goals, architecture, and technology stack..."
          className="w-full rounded-lg border border-border bg-zinc-900 px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-lg border border-border bg-zinc-900 px-3 py-2 text-xs text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="PLANNING">Planning</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="ON_HOLD">On Hold</option>
        </select>
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
          {initialData ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}
