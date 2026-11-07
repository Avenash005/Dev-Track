import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
