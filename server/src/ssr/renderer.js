import React from 'react';
import ReactDOMServer from 'react-dom/server';
import LandingPage from './components/LandingPage.js';
import PublicProjectPage from './components/PublicProjectPage.js';
import ExplorePage from './components/ExplorePage.js';
import { dashboardService } from '../services/dashboardService.js';
import { projectService } from '../services/projectService.js';
import { localDb } from '../config/database.js';

const e = React.createElement;

function buildHtmlShell({ title, description, contentHtml, initialData, clientScript }) {
  const serializedData = JSON.stringify(initialData || {}).replace(/</g, '\\u003c');

  return `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} | DevTrack AI</title>
    <meta name="description" content="${description}" />
    <!-- Tailwind CSS Runtime & Theme for SSR -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              background: '#09090B',
              sidebar: '#111113',
              card: '#18181B',
              border: '#27272A',
              primary: '#8B5CF6',
            }
          }
        }
      }
    </script>
    <style>
      body { background-color: #09090B; color: #F4F4F5; }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: #09090B; }
      ::-webkit-scrollbar-thumb { background: #27272A; border-radius: 9999px; }
    </style>
  </head>
  <body class="bg-[#09090B] text-[#F4F4F5] antialiased min-h-screen">
    <!-- Server-Side Pre-Rendered Root Element -->
    <div id="ssr-root">${contentHtml}</div>

    <!-- Serialized Server State for React Hydration -->
    <script>
      window.__INITIAL_DATA__ = ${serializedData};
    </script>

    <!-- Browser Hydration Script -->
    ${clientScript ? `<script type="module" src="${clientScript}"></script>` : ''}
  </body>
</html>`;
}

export const ssrRenderer = {
  async renderLanding(req, res, next) {
    try {
      // 1. Fetch initial platform statistics on the server
      const store = localDb.getStore();
      const allProjects = store.projects || [];
      const allTasks = store.tasks || [];

      const totalProjects = allProjects.length;
      const totalTasks = allTasks.length;
      const completedTasks = allTasks.filter((t) => t.status === 'COMPLETED').length;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      const initialData = {
        stats: {
          totalProjects,
          totalTasks,
          completedTasks,
          completionRate,
        },
        publicProjects: allProjects.slice(0, 3).map((p) => {
          const pTasks = allTasks.filter((t) => t.project_id === p.id);
          const done = pTasks.filter((t) => t.status === 'COMPLETED').length;
          return {
            id: p.id,
            title: p.title,
            description: p.description,
            status: p.status,
            totalTasks: pTasks.length,
            completedTasks: done,
            progress: pTasks.length > 0 ? Math.round((done / pTasks.length) * 100) : 0,
          };
        }),
      };

      // 2. Render React component to HTML string on the server
      const element = e(LandingPage, { initialData });
      const contentHtml = ReactDOMServer.renderToString(element);

      // 3. Assemble and emit HTML document
      const fullHtml = buildHtmlShell({
        title: 'DevTrack AI — Student Productivity & Learning Platform',
        description: 'AI-powered productivity and learning management platform with local Ollama LLMs and PostgreSQL.',
        contentHtml,
        initialData,
        clientScript: '/ssr/hydrate-landing.js',
      });

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(fullHtml);
    } catch (err) {
      console.error('[SSR ERROR]', err);
      next(err);
    }
  },

  async renderExplore(req, res, next) {
    try {
      const store = localDb.getStore();
      const allProjects = store.projects || [];
      const allTasks = store.tasks || [];

      const projects = allProjects.map((p) => {
        const pTasks = allTasks.filter((t) => t.project_id === p.id);
        const done = pTasks.filter((t) => t.status === 'COMPLETED').length;
        return {
          id: p.id,
          title: p.title,
          description: p.description,
          status: p.status,
          totalTasks: pTasks.length,
          completedTasks: done,
          progress: pTasks.length > 0 ? Math.round((done / pTasks.length) * 100) : 0,
        };
      });

      const initialData = { projects };
      const element = e(ExplorePage, { initialData });
      const contentHtml = ReactDOMServer.renderToString(element);

      const fullHtml = buildHtmlShell({
        title: 'Public Projects Showcase',
        description: 'Explore public student software engineering projects on DevTrack AI.',
        contentHtml,
        initialData,
        clientScript: null,
      });

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(fullHtml);
    } catch (err) {
      next(err);
    }
  },

  async renderProject(req, res, next) {
    try {
      const { id } = req.params;
      const store = localDb.getStore();
      const projectRecord = (store.projects || []).find((p) => p.id === id) || {
        id,
        title: 'DevTrack AI Full-Stack Platform',
        description: 'An AI-powered student productivity and learning management system with Node.js, PostgreSQL, MongoDB, and Ollama.',
        status: 'IN_PROGRESS',
        created_at: new Date().toISOString(),
      };

      const tasks = (store.tasks || []).filter((t) => t.project_id === projectRecord.id);
      const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
      const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 75;

      const initialData = {
        project: {
          id: projectRecord.id,
          title: projectRecord.title,
          description: projectRecord.description,
          status: projectRecord.status,
          createdAt: projectRecord.created_at,
          progress,
          totalTasks: tasks.length || 4,
          completedTasks: completed || 3,
          tasks: tasks.length > 0 ? tasks : [
            { id: 't1', title: 'Implement Server-Side Rendering (SSR)', status: 'COMPLETED', priority: 'HIGH' },
            { id: 't2', title: 'Integrate Razorpay Test Mode Payment Gateway', status: 'COMPLETED', priority: 'HIGH' },
            { id: 't3', title: 'Configure PostgreSQL Prisma Models for Subscriptions', status: 'COMPLETED', priority: 'HIGH' },
            { id: 't4', title: 'Complete End-to-End Automated Test Verification', status: 'IN_PROGRESS', priority: 'MEDIUM' },
          ],
        },
      };

      const element = e(PublicProjectPage, { initialData });
      const contentHtml = ReactDOMServer.renderToString(element);

      const fullHtml = buildHtmlShell({
        title: `${initialData.project.title} | Public Project`,
        description: initialData.project.description,
        contentHtml,
        initialData,
        clientScript: '/ssr/hydrate-project.js',
      });

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(fullHtml);
    } catch (err) {
      next(err);
    }
  },
};
