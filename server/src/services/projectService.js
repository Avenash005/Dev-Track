import { prisma, isPostgresConnected, localDb } from '../config/database.js';

export const projectService = {
  async getProjects(userId) {
    if (isPostgresConnected) {
      const projects = await prisma.project.findMany({
        where: { user_id: userId },
        include: {
          tasks: {
            select: { id: true, status: true },
          },
        },
        orderBy: { created_at: 'desc' },
      });

      return projects.map((p) => {
        const totalTasks = p.tasks.length;
        const completedTasks = p.tasks.filter((t) => t.status === 'COMPLETED').length;
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        return {
          id: p.id,
          userId: p.user_id,
          title: p.title,
          description: p.description,
          status: p.status,
          totalTasks,
          completedTasks,
          progress,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        };
      });
    } else {
      const store = localDb.getStore();
      const userProjects = store.projects.filter((p) => p.user_id === userId);

      return userProjects.map((p) => {
        const tasks = store.tasks.filter((t) => t.project_id === p.id);
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        return {
          id: p.id,
          userId: p.user_id,
          title: p.title,
          description: p.description,
          status: p.status,
          totalTasks,
          completedTasks,
          progress,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        };
      });
    }
  },

  async getProjectById(userId, projectId) {
    if (isPostgresConnected) {
      const project = await prisma.project.findFirst({
        where: { id: projectId, user_id: userId },
        include: {
          tasks: {
            orderBy: { created_at: 'desc' },
          },
        },
      });

      if (!project) {
        const error = new Error('Project not found or you do not have permission to access it.');
        error.statusCode = 404;
        throw error;
      }

      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter((t) => t.status === 'COMPLETED').length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        id: project.id,
        userId: project.user_id,
        title: project.title,
        description: project.description,
        status: project.status,
        totalTasks,
        completedTasks,
        progress,
        tasks: project.tasks.map((t) => ({
          id: t.id,
          projectId: t.project_id,
          title: t.title,
          description: t.description,
          status: t.status,
          priority: t.priority,
          dueDate: t.due_date,
          createdAt: t.created_at,
        })),
        createdAt: project.created_at,
        updatedAt: project.updated_at,
      };
    } else {
      const store = localDb.getStore();
      const project = store.projects.find((p) => p.id === projectId && p.user_id === userId);

      if (!project) {
        const error = new Error('Project not found or you do not have permission to access it.');
        error.statusCode = 404;
        throw error;
      }

      const tasks = store.tasks.filter((t) => t.project_id === project.id);
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        id: project.id,
        userId: project.user_id,
        title: project.title,
        description: project.description,
        status: project.status,
        totalTasks,
        completedTasks,
        progress,
        tasks: tasks.map((t) => ({
          id: t.id,
          projectId: t.project_id,
          title: t.title,
          description: t.description,
          status: t.status,
          priority: t.priority,
          dueDate: t.due_date,
          createdAt: t.created_at,
        })),
        createdAt: project.created_at,
        updatedAt: project.updated_at,
      };
    }
  },

  async createProject(userId, { title, description, status = 'PLANNING' }) {
    if (isPostgresConnected) {
      const created = await prisma.project.create({
        data: {
          user_id: userId,
          title,
          description: description || null,
          status,
        },
      });
      return {
        id: created.id,
        userId: created.user_id,
        title: created.title,
        description: created.description,
        status: created.status,
        createdAt: created.created_at,
        updatedAt: created.updated_at,
      };
    } else {
      const store = localDb.getStore();
      const newProject = {
        id: `proj-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        user_id: userId,
        title,
        description: description || '',
        status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      store.projects.unshift(newProject);
      localDb.save();

      return {
        id: newProject.id,
        userId: newProject.user_id,
        title: newProject.title,
        description: newProject.description,
        status: newProject.status,
        createdAt: newProject.created_at,
        updatedAt: newProject.updated_at,
      };
    }
  },

  async updateProject(userId, projectId, { title, description, status }) {
    await this.getProjectById(userId, projectId); // verifies ownership

    if (isPostgresConnected) {
      const updated = await prisma.project.update({
        where: { id: projectId },
        data: {
          ...(title && { title }),
          ...(description !== undefined && { description }),
          ...(status && { status }),
        },
      });
      return {
        id: updated.id,
        userId: updated.user_id,
        title: updated.title,
        description: updated.description,
        status: updated.status,
        createdAt: updated.created_at,
        updatedAt: updated.updated_at,
      };
    } else {
      const store = localDb.getStore();
      const p = store.projects.find((item) => item.id === projectId && item.user_id === userId);
      if (title) p.title = title;
      if (description !== undefined) p.description = description;
      if (status) p.status = status;
      p.updated_at = new Date().toISOString();
      localDb.save();

      return {
        id: p.id,
        userId: p.user_id,
        title: p.title,
        description: p.description,
        status: p.status,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      };
    }
  },

  async deleteProject(userId, projectId) {
    await this.getProjectById(userId, projectId); // verifies ownership

    if (isPostgresConnected) {
      await prisma.project.delete({
        where: { id: projectId },
      });
    } else {
      const store = localDb.getStore();
      store.projects = store.projects.filter((p) => p.id !== projectId);
      store.tasks = store.tasks.filter((t) => t.project_id !== projectId);
      localDb.save();
    }
    return true;
  },
};
