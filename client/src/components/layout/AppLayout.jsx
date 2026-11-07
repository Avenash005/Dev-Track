import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
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

  const { addProject, addTask } = useData();

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
    </div>
  );
}

