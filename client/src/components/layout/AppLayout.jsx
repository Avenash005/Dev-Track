import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Radio, X } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import Modal from '../common/Modal';
import ProjectForm from '../projects/ProjectForm';
import TaskForm from '../tasks/TaskForm';
import { useData } from '../../context/DataContext';

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { addProject, addTask, realtimeNotification, dismissNotification } = useData();

  const handleCreateProject = (projectData) => {
    addProject(projectData);
    setIsProjectModalOpen(false);
  };

  const handleCreateTask = (taskData) => {
    addTask(taskData);
    setIsTaskModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      {/* Sidebar navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          onOpenMobileSidebar={() => setMobileOpen(true)}
          onOpenNewProject={() => setIsProjectModalOpen(true)}
          onOpenNewTask={() => setIsTaskModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet context={{ searchQuery }} />
          </div>
        </main>
      </div>

      {/* Global New Project Modal */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Create New Project"
        subtitle="Organize your development modules, milestones, and deliverables."
      >
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setIsProjectModalOpen(false)}
        />
      </Modal>

      {/* Global New Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Create New Task"
        subtitle="Add a trackable engineering action item with deadline and priority."
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsTaskModalOpen(false)}
        />
      </Modal>

      {/* Real-time WebSocket Live Sync Toast Notification */}
      {realtimeNotification && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-xl shadow-black/40"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <div className="text-sm">
            <p className="font-medium text-text-primary flex items-center gap-1.5">
              <Radio size={13} className="text-emerald-400 animate-pulse" />
              Real-Time Sync
            </p>
            <p className="text-xs text-text-secondary">{realtimeNotification.message}</p>
          </div>
          <button
            onClick={dismissNotification}
            className="ml-3 text-text-secondary hover:text-text-primary"
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </aside>
      )}
    </div>
  );
}
