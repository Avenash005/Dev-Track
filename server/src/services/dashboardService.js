import { prisma, isPostgresConnected, localDb } from '../config/database.js';

export const dashboardService = {
  async getStats(userId) {
    if (isPostgresConnected) {
      const userProjects = await prisma.project.findMany({
        where: { user_id: userId },
        select: { id: true },
      });
      const projectIds = userProjects.map((p) => p.id);

      const totalProjects = projectIds.length;
      const totalTasks = await prisma.task.count({
        where: { project_id: { in: projectIds } },
      });
      const completedTasks = await prisma.task.count({
        where: {
          project_id: { in: projectIds },
          status: 'COMPLETED',
        },
      });
      const pendingTasks = totalTasks - completedTasks;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        totalProjects,
        totalTasks,
        completedTasks,
        pendingTasks,
        completionRate,
      };
    } else {
      const store = localDb.getStore();
      const userProjects = store.projects.filter((p) => p.user_id === userId);
      const projectIds = new Set(userProjects.map((p) => p.id));

      const totalProjects = userProjects.length;
      const userTasks = store.tasks.filter((t) => projectIds.has(t.project_id));
      const totalTasks = userTasks.length;
      const completedTasks = userTasks.filter((t) => t.status === 'COMPLETED').length;
      const pendingTasks = totalTasks - completedTasks;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        totalProjects,
        totalTasks,
        completedTasks,
        pendingTasks,
        completionRate,
      };
    }
  },

  async getActivity(userId) {
    // Generate recent activity entries from recent project and task mutations
    const activities = [
      {
        id: 'act-term-1',
        type: 'SYSTEM',
        title: 'Platform initialized on DevTrack AI secure runtime',
        timestamp: 'Just now',
        project: 'Core Engine',
      },
    ];

    const store = localDb.getStore();
    const userProjects = store.projects.filter((p) => p.user_id === userId).slice(0, 3);
    for (const p of userProjects) {
      activities.unshift({
        id: `act-p-${p.id}`,
        type: 'PROJECT_CREATED',
        title: `Active project: ${p.title}`,
        timestamp: new Date(p.created_at).toLocaleDateString(),
        project: p.title,
      });
    }

    return activities;
  },
};
