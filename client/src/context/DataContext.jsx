import React, { createContext, useContext, useState, useMemo } from 'react';

const DataContext = createContext(null);

const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    title: 'DevTrack AI Full-Stack Platform',
    description: 'AI-powered productivity and learning management system with Node.js, PostgreSQL, MongoDB, and Ollama.',
    status: 'IN_PROGRESS',
    createdAt: '2026-11-01T10:00:00Z',
    updatedAt: '2026-11-05T14:30:00Z',
  },
  {
    id: 'proj-2',
    title: 'Distributed System Microservices',
    description: 'Event-driven architecture using Kafka, Redis caching, and Docker container orchestration.',
    status: 'PLANNING',
    createdAt: '2026-10-25T08:30:00Z',
    updatedAt: '2026-11-02T11:20:00Z',
  },
  {
    id: 'proj-3',
    title: 'Algorithms & Data Structures Mastery',
    description: 'Weekly solutions and space-time complexity analysis for LeetCode dynamic programming and graph problems.',
    status: 'COMPLETED',
    createdAt: '2026-10-10T09:15:00Z',
    updatedAt: '2026-10-30T17:45:00Z',
  },
];

const INITIAL_TASKS = [
  {
    id: 'task-1',
    projectId: 'proj-1',
    title: 'Implement Dark Theme Dashboard UI',
    description: 'Construct responsive Tailwind CSS dashboard layout matching #09090B palette.',
    status: 'COMPLETED',
    priority: 'HIGH',
    dueDate: '2026-11-07',
    createdAt: '2026-11-01T11:00:00Z',
  },
  {
    id: 'task-2',
    projectId: 'proj-1',
    title: 'Design PostgreSQL & MongoDB Hybrid Schemas',
    description: 'Define relational entities in Prisma and document schemas in Mongoose for AI chat sessions.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: '2026-11-09',
    createdAt: '2026-11-02T14:00:00Z',
  },
  {
    id: 'task-3',
    projectId: 'proj-1',
    title: 'Integrate Ollama Local AI LLM Proxy',
    description: 'Build Express router proxying requests to local Ollama API at localhost:11434 with error fallback.',
    status: 'PENDING',
    priority: 'HIGH',
    dueDate: '2026-11-12',
    createdAt: '2026-11-03T09:00:00Z',
  },
  {
    id: 'task-4',
    projectId: 'proj-2',
    title: 'Configure Docker Compose for PostgreSQL & Mongo',
    description: 'Write docker-compose.yml file to spin up databases with health checks and volume persistence.',
    status: 'PENDING',
    priority: 'MEDIUM',
    dueDate: '2026-11-15',
    createdAt: '2026-11-04T16:20:00Z',
  },
  {
    id: 'task-5',
    projectId: 'proj-3',
    title: 'Complete Graph Dijkstra & Bellman-Ford Visualizer',
    description: 'Write comprehensive test suite and complexity notes for shortest-path graph traversals.',
    status: 'COMPLETED',
    priority: 'LOW',
    dueDate: '2026-10-28',
    createdAt: '2026-10-15T13:10:00Z',
  },
];

const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    type: 'TASK_COMPLETED',
    title: 'Completed task: Implement Dark Theme Dashboard UI',
    timestamp: '25 minutes ago',
    project: 'DevTrack AI Full-Stack Platform',
  },
  {
    id: 'act-2',
    type: 'PROJECT_CREATED',
    title: 'Created project: Distributed System Microservices',
    timestamp: '2 hours ago',
    project: 'Distributed System Microservices',
  },
  {
    id: 'act-3',
    type: 'AI_QUERY',
    title: 'Prompted AI Assistant on JavaScript Event Loop Microtasks',
    timestamp: 'Yesterday',
    project: 'DevTrack AI Full-Stack Platform',
  },
];

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);

  // Computed dashboard statistics
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate: Math.round(completionRate),
    };
  }, [projects, tasks]);

  // Project operations
  const addProject = (projectData) => {
    const newProject = {
      ...projectData,
      id: 'proj-' + Date.now(),
      status: projectData.status || 'PLANNING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects((prev) => [newProject, ...prev]);
    setActivities((prev) => [
      {
        id: 'act-' + Date.now(),
        type: 'PROJECT_CREATED',
        title: `Created project: ${newProject.title}`,
        timestamp: 'Just now',
        project: newProject.title,
      },
      ...prev,
    ]);
    return newProject;
  };

  const updateProject = (id, updates) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
  };

  const deleteProject = (id) => {
    const project = projects.find((p) => p.id === id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
    if (project) {
      setActivities((prev) => [
        {
          id: 'act-' + Date.now(),
          type: 'PROJECT_DELETED',
          title: `Deleted project: ${project.title}`,
          timestamp: 'Just now',
          project: project.title,
        },
        ...prev,
      ]);
    }
  };

  // Task operations
  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: 'task-' + Date.now(),
      status: taskData.status || 'PENDING',
      priority: taskData.priority || 'MEDIUM',
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    const project = projects.find((p) => p.id === newTask.projectId);
    setActivities((prev) => [
      {
        id: 'act-' + Date.now(),
        type: 'TASK_CREATED',
        title: `Created task: ${newTask.title}`,
        timestamp: 'Just now',
        project: project ? project.title : 'General',
      },
      ...prev,
    ]);
    return newTask;
  };

  const updateTask = (id, updates) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (task) {
      setActivities((prev) => [
        {
          id: 'act-' + Date.now(),
          type: 'TASK_DELETED',
          title: `Deleted task: ${task.title}`,
          timestamp: 'Just now',
          project: 'Project Task',
        },
        ...prev,
      ]);
    }
  };

  const toggleTaskStatus = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
          if (nextStatus === 'COMPLETED') {
            setActivities((acts) => [
              {
                id: 'act-' + Date.now(),
                type: 'TASK_COMPLETED',
                title: `Completed task: ${t.title}`,
                timestamp: 'Just now',
                project: 'DevTrack',
              },
              ...acts,
            ]);
          }
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        tasks,
        activities,
        stats,
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

