import React from 'react';
import { Menu, Search, Bell, Plus, Sparkles, FolderPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header({
  onOpenMobileSidebar,
  onOpenNewProject,
  onOpenNewTask,
  searchQuery,
  setSearchQuery,
}) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Left section: mobile hamburger + search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="rounded-lg p-2 text-text-muted hover:bg-card hover:text-text-primary lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search input */}
        <div className="relative hidden w-72 sm:block md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            placeholder="Search projects, tasks, or concepts..."
            className="w-full rounded-lg border border-border bg-card/60 py-1.5 pl-9 pr-4 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Right section: Quick actions + Notifications + Profile */}
      <div className="flex items-center gap-2.5">
        {onOpenNewProject && (
          <button
            onClick={onOpenNewProject}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-text-primary hover:border-zinc-700 hover:bg-zinc-800 transition active:scale-95"
          >
            <FolderPlus className="h-3.5 w-3.5 text-primary" />
            <span>New Project</span>
          </button>
        )}

        {onOpenNewTask && (
          <button
            onClick={onOpenNewTask}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-primary-hover transition active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Task</span>
          </button>
        )}

        {/* Notification bell */}
        <button
          title="Notifications"
          className="relative rounded-lg p-2 text-text-muted hover:bg-card hover:text-text-primary transition"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        </button>

        {/* User avatar indicator */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 border border-border text-xs font-semibold text-text-primary">
          {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AL'}
        </div>
      </div>
    </header>
  );
}

