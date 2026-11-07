import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Bot,
  GraduationCap,
  Settings,
  Sparkles,
  LogOut,
  Terminal,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'AI Assistant', path: '/ai', icon: Bot, badge: 'Ollama' },
  { name: 'Learn Concepts', path: '/learn', icon: GraduationCap, badge: 'JS' },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-sidebar transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-hover shadow-md shadow-primary/20">
            <Terminal className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-text-primary text-base">DevTrack</span>
              <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary-light">
                AI
              </span>
            </div>
            <p className="text-[10px] text-text-muted">Student Productivity OS</p>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Core Modules
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-primary/10 text-primary-light font-semibold shadow-inner shadow-primary/10 border-l-2 border-primary'
                      : 'text-text-secondary hover:bg-zinc-800/60 hover:text-text-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive ? 'text-primary' : 'text-text-muted group-hover:text-text-primary'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                          isActive
                            ? 'bg-primary/20 text-primary-light'
                            : 'bg-zinc-800 text-text-muted'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* System & AI status pill */}
        <div className="p-3">
          <div className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-text-secondary">AI Core</span>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Ollama 3.2
              </span>
            </div>
            <p className="mt-1 text-[10px] text-text-muted">
              Running locally via Express proxy at port 5000.
            </p>
          </div>
        </div>

        {/* User profile & Logout */}
        <div className="border-t border-border p-3">
          <div className="flex items-center justify-between rounded-lg p-2 hover:bg-zinc-800/60 transition">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 border border-primary/30 text-xs font-bold text-primary-light">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="truncate">
                <p className="truncate text-xs font-medium text-text-primary">
                  {user?.name || 'Student Developer'}
                </p>
                <p className="truncate text-[10px] text-text-muted">
                  {user?.email || 'alex.chen@devtrack.ai'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="rounded p-1.5 text-text-muted hover:bg-zinc-800 hover:text-rose-400 transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

