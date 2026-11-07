import { prisma, isPostgresConnected, localDb } from '../config/database.js';

export const taskService = {
  async getTasks(userId, { status, priority, search, projectId } = {}) {
    if (isPostgresConnected) {
      // Find all project IDs owned by this user
      const userProjects = await prisma.project.findMany({
        where: { user_id: userId },
        select: { id: true, title: true },
      });
      const projectIds = userProjects.map((p) => p.id);
      const projectMap = Object.fromEntries(userProjects.map((p) => [p.id, p.title]));

      const where = {
        project_id: projectId ? projectId : { in: projectIds },
      };

      if (status && status !== 'ALL') {
        where.status = status;
      }
      if (priority && priority !== 'ALL') {
        where.priority = priority;
      }
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      const tasks = await prisma.task.findMany({
        where,
        orderBy: { created_at: 'desc' },
      });

      return tasks.map((t) => ({
        id: t.id,
        projectId: t.project_id,
        projectTitle: projectMap[t.project_id] || 'General',
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        dueDate: t.due_date,
        createdAt: t.created_at,
      }));
    } else {
      const store = localDb.getStore();
      const userProjects = store.projects.filter((p) => p.user_id === userId);
      const projectIds = new Set(userProjects.map((p) => p.id));
      const projectMap = Object.fromEntries(userProjects.map((p) => [p.id, p.title]));

      let tasks = store.tasks.filter((t) => {
        if (!projectIds.has(t.project_id)) return false;
        if (projectId && t.project_id !== projectId) return false;
        if (status && status !== 'ALL' && t.status !== status) return false;
        if (priority && priority !== 'ALL' && t.priority !== priority) return false;
        if (search) {
          const q = search.toLowerCase();
          const matchTitle = t.title.toLowerCase().includes(q);
          const matchDesc = t.description?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc) return false;
        }
        return true;
      });

      return tasks.map((t) => ({
        id: t.id,
        projectId: t.project_id,
        projectTitle: projectMap[t.project_id] || 'General',
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        dueDate: t.due_date,
        createdAt: t.created_at,
      }));
    }
  },

  async getTaskById(userId, taskId) {
    if (isPostgresConnected) {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { project: true },
      });

      if (!task || task.project.user_id !== userId) {
        const error = new Error('Task not found or permission denied.');
        error.statusCode = 404;
        throw error;
      }

      return {
        id: task.id,
        projectId: task.project_id,
        projectTitle: task.project.title,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.due_date,
        createdAt: task.created_at,
      };
    } else {
      const store = localDb.getStore();
      const task = store.tasks.find((t) => t.id === taskId);
      if (!task) {
        const error = new Error('Task not found or permission denied.');
        error.statusCode = 404;
        throw error;
      }

      const project = store.projects.find((p) => p.id === task.project_id && p.user_id === userId);
      if (!project) {
        const error = new Error('Task not found or permission denied.');
        error.statusCode = 404;
        throw error;
      }

      return {
        id: task.id,
        projectId: task.project_id,
        projectTitle: project.title,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.due_date,
        createdAt: task.created_at,
      };
    }
  },

  async createTask(userId, { projectId, title, description, status = 'PENDING', priority = 'MEDIUM', dueDate }) {
    // Verify that the target project belongs to the requesting user
    if (isPostgresConnected) {
      const project = await prisma.project.findFirst({
        where: { id: projectId, user_id: userId },
      });
      if (!project) {
        const error = new Error('Cannot assign task to a project that does not exist or is not owned by you.');
        error.statusCode = 400;
        throw error;
      }

      const created = await prisma.task.create({
        data: {
          project_id: projectId,
          title,
          description: description || null,
          status,
          priority,
          due_date: dueDate || null,
        },
      });

      return {
        id: created.id,
        projectId: created.project_id,
        projectTitle: project.title,
        title: created.title,
        description: created.description,
        status: created.status,
        priority: created.priority,
        dueDate: created.due_date,
        createdAt: created.created_at,
      };
    } else {
      const store = localDb.getStore();
      const project = store.projects.find((p) => p.id === projectId && p.user_id === userId);
      if (!project) {
        const error = new Error('Cannot assign task to a project that does not exist or is not owned by you.');
        error.statusCode = 400;
        throw error;
      }

      const newTask = {
        id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        project_id: projectId,
        title,
        description: description || '',
        status,
        priority,
        due_date: dueDate || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      store.tasks.unshift(newTask);
      localDb.save();

      return {
        id: newTask.id,
        projectId: newTask.project_id,
        projectTitle: project.title,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        priority: newTask.priority,
        dueDate: newTask.due_date,
        createdAt: newTask.created_at,
      };
    }
  },

  async updateTask(userId, taskId, updates) {
    await this.getTaskById(userId, taskId); // verifies ownership

    if (isPostgresConnected) {
      const updated = await prisma.task.update({
        where: { id: taskId },
        data: {
          ...(updates.title && { title: updates.title }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.status && { status: updates.status }),
          ...(updates.priority && { priority: updates.priority }),
          ...(updates.dueDate !== undefined && { due_date: updates.dueDate }),
        },
      });

      return {
        id: updated.id,
        projectId: updated.project_id,
        title: updated.title,
        description: updated.description,
        status: updated.status,
        priority: updated.priority,
        dueDate: updated.due_date,
        createdAt: updated.created_at,
      };
    } else {
      const store = localDb.getStore();
      const task = store.tasks.find((t) => t.id === taskId);
      if (updates.title) task.title = updates.title;
      if (updates.description !== undefined) task.description = updates.description;
      if (updates.status) task.status = updates.status;
      if (updates.priority) task.priority = updates.priority;
      if (updates.dueDate !== undefined) task.due_date = updates.dueDate;
      task.updated_at = new Date().toISOString();
      localDb.save();

      return {
        id: task.id,
        projectId: task.project_id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.due_date,
        createdAt: task.created_at,
      };
    }
  },

  async deleteTask(userId, taskId) {
    await this.getTaskById(userId, taskId); // verifies ownership

    if (isPostgresConnected) {
      await prisma.task.delete({
        where: { id: taskId },
      });
    } else {
      const store = localDb.getStore();
      store.tasks = store.tasks.filter((t) => t.id !== taskId);
      localDb.save();
    }
    return true;
  },
};
