import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { socketService } from '../services/socket';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [realtimeNotification, setRealtimeNotification] = useState(null);

  const notifyRealtime = useCallback((message, type = 'info') => {
    setRealtimeNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setRealtimeNotification((curr) => (curr?.id ? null : curr));
    }, 4000);
  }, []);

  const dismissNotification = useCallback(() => {
    setRealtimeNotification(null);
  }, []);

  // Fetch all data from backend
  const refreshData = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);

    try {
      const [projRes, taskRes, actRes] = await Promise.allSettled([
        api.projects.getAll(),
        api.tasks.getAll(),
        api.dashboard.getActivity(),
      ]);

      if (projRes.status === 'fulfilled' && projRes.value?.data) {
        setProjects(projRes.value.data);
      }
      if (taskRes.status === 'fulfilled' && taskRes.value?.data) {
        setTasks(taskRes.value.data);
      }
      if (actRes.status === 'fulfilled' && actRes.value?.data) {
        setActivities(actRes.value.data);
      }
    } catch (err) {
      console.error('[DATA] Failed to load data from backend:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    } else {
      setProjects([]);
      setTasks([]);
      setActivities([]);
    }
  }, [isAuthenticated, refreshData]);

  // Subscribe to real-time WebSocket events with automatic cleanup
  useEffect(() => {
    if (!isAuthenticated) return;

    // 1. Task Created
    const handleTaskCreated = (payload) => {
      const task = payload?.data?.task || payload?.task;
      if (!task) return;
      setTasks((prev) => (prev.some((t) => t.id === task.id) ? prev : [task, ...prev]));
      notifyRealtime(`New task "${task.title}" created via real-time sync`, 'success');
    };

    // 2. Task Updated
    const handleTaskUpdated = (payload) => {
      const task = payload?.data?.task || payload?.task;
      if (!task) return;
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, ...task } : t)));
      notifyRealtime(`Task "${task.title}" updated`, 'info');
    };

    // 3. Task Status Changed
    const handleTaskStatusChanged = (payload) => {
      const task = payload?.data?.task || payload?.task;
      if (!task) return;
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, ...task } : t)));
      notifyRealtime(`Task status changed to ${task.status}`, 'info');
    };

    // 4. Task Deleted
    const handleTaskDeleted = (payload) => {
      const taskId = payload?.data?.taskId || payload?.taskId;
      if (!taskId) return;
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      notifyRealtime('Task deleted', 'warning');
    };

    // 5. Project Created
    const handleProjectCreated = (payload) => {
      const project = payload?.data?.project || payload?.project;
      if (!project) return;
      setProjects((prev) => (prev.some((p) => p.id === project.id) ? prev : [project, ...prev]));
      notifyRealtime(`Project "${project.title}" created`, 'success');
    };

    // 6. Project Updated
    const handleProjectUpdated = (payload) => {
      const project = payload?.data?.project || payload?.project;
      if (!project) return;
      setProjects((prev) => prev.map((p) => (p.id === project.id ? { ...p, ...project } : p)));
      notifyRealtime(`Project "${project.title}" updated`, 'info');
    };

    // 7. Project Deleted
    const handleProjectDeleted = (payload) => {
      const projectId = payload?.data?.projectId || payload?.projectId;
      if (!projectId) return;
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      setTasks((prev) => prev.filter((t) => t.projectId !== projectId));
      notifyRealtime('Project deleted', 'warning');
    };

    // 8. Dashboard Activity Updated
    const handleDashboardUpdated = () => {
      api.dashboard.getActivity().then((res) => {
        if (res?.data) setActivities(res.data);
      }).catch(() => {});
    };

    socketService.on('task:created', handleTaskCreated);
    socketService.on('task:updated', handleTaskUpdated);
    socketService.on('task:status_changed', handleTaskStatusChanged);
    socketService.on('task:deleted', handleTaskDeleted);
    socketService.on('project:created', handleProjectCreated);
    socketService.on('project:updated', handleProjectUpdated);
    socketService.on('project:deleted', handleProjectDeleted);
    socketService.on('dashboard:updated', handleDashboardUpdated);

    return () => {
      socketService.off('task:created', handleTaskCreated);
      socketService.off('task:updated', handleTaskUpdated);
      socketService.off('task:status_changed', handleTaskStatusChanged);
      socketService.off('task:deleted', handleTaskDeleted);
      socketService.off('project:created', handleProjectCreated);
      socketService.off('project:updated', handleProjectUpdated);
      socketService.off('project:deleted', handleProjectDeleted);
      socketService.off('dashboard:updated', handleDashboardUpdated);
    };
  }, [isAuthenticated, notifyRealtime]);

  // Computed dashboard statistics
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
    };
  }, [projects, tasks]);

  // Project operations
  const addProject = async (projectData) => {
    try {
      const res = await api.projects.create(projectData);
      if (res?.data) {
        setProjects((prev) => [res.data, ...prev]);
        refreshData();
        return res.data;
      }
    } catch (err) {
      console.error('[DATA] addProject error:', err.message);
      throw err;
    }
  };

  const updateProject = async (id, updates) => {
    try {
      const res = await api.projects.update(id, updates);
      if (res?.data) {
        setProjects((prev) => prev.map((p) => (p.id === id ? res.data : p)));
        refreshData();
        return res.data;
      }
    } catch (err) {
      console.error('[DATA] updateProject error:', err.message);
      throw err;
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.projects.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setTasks((prev) => prev.filter((t) => t.projectId !== id));
      refreshData();
    } catch (err) {
      console.error('[DATA] deleteProject error:', err.message);
      throw err;
    }
  };

  // Task operations
  const addTask = async (taskData) => {
    try {
      const res = await api.tasks.create(taskData);
      if (res?.data) {
        setTasks((prev) => [res.data, ...prev]);
        refreshData();
        return res.data;
      }
    } catch (err) {
      console.error('[DATA] addTask error:', err.message);
      throw err;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const res = await api.tasks.update(id, updates);
      if (res?.data) {
        setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
        refreshData();
        return res.data;
      }
    } catch (err) {
      console.error('[DATA] updateTask error:', err.message);
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.tasks.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      refreshData();
    } catch (err) {
      console.error('[DATA] deleteTask error:', err.message);
      throw err;
    }
  };

  const toggleTaskStatus = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const nextStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
    );

    try {
      await api.tasks.update(id, { status: nextStatus });
      refreshData();
    } catch (err) {
      // Revert if API fails
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: task.status } : t))
      );
      console.error('[DATA] toggleTaskStatus error:', err.message);
    }
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        tasks,
        activities,
        stats,
        loading,
        error,
        realtimeNotification,
        dismissNotification,
        refreshData,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
