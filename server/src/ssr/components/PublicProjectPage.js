import React, { useState } from 'react';

const e = React.createElement;

export default function PublicProjectPage({ initialData }) {
  const project = initialData?.project || {
    id: 'proj-public-demo',
    title: 'DevTrack AI Full-Stack Platform',
    description: 'An AI-powered student productivity and learning management system with Node.js, PostgreSQL, MongoDB, and Ollama.',
    status: 'IN_PROGRESS',
    progress: 75,
    totalTasks: 4,
    completedTasks: 3,
    createdAt: new Date().toISOString(),
    tasks: [
      { id: 't1', title: 'Implement Server-Side Rendering (SSR)', status: 'COMPLETED', priority: 'HIGH' },
      { id: 't2', title: 'Integrate Razorpay Test Mode Payment Gateway', status: 'COMPLETED', priority: 'HIGH' },
      { id: 't3', title: 'Configure PostgreSQL Prisma Models for Subscriptions', status: 'COMPLETED', priority: 'HIGH' },
      { id: 't4', title: 'Complete End-to-End Automated Test Verification', status: 'IN_PROGRESS', priority: 'MEDIUM' },
    ],
  };

  const [activeTab, setActiveTab] = useState('tasks');

  return e(
    'div',
    { className: 'min-h-screen bg-[#09090B] text-[#F4F4F5] font-sans antialiased' },

    // Top Navigation
    e(
      'header',
      { className: 'border-b border-[#27272A] bg-[#09090B]/80 px-6 py-4' },
      e(
        'div',
        { className: 'mx-auto flex max-w-7xl items-center justify-between' },
        e(
          'a',
          { href: '/', className: 'flex items-center gap-2 text-sm font-bold text-white' },
          e('span', { className: 'text-[#8B5CF6]' }, '←'),
          'Back to DevTrack AI Home'
        ),
        e(
          'div',
          { className: 'flex items-center gap-2' },
          e('span', { className: 'rounded-full bg-[#10B981]/10 border border-[#10B981]/30 px-2.5 py-0.5 text-xs text-[#10B981] font-semibold' }, 'Public Showcase (SSR)'),
          e('a', { href: '/login', className: 'rounded-lg bg-[#8B5CF6] px-3.5 py-1 text-xs text-white' }, 'Sign In')
        )
      )
    ),

    // Main Content Container
    e(
      'main',
      { className: 'mx-auto max-w-5xl px-6 py-12 space-y-8' },

      // Project Header Card
      e(
        'div',
        { className: 'rounded-2xl border border-[#27272A] bg-[#18181B] p-6 sm:p-8 space-y-4' },
        e(
          'div',
          { className: 'flex flex-wrap items-center justify-between gap-3' },
          e('span', { className: 'rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 px-3 py-1 text-xs font-semibold text-[#A78BFA]' }, project.status),
          e('span', { className: 'text-xs text-[#A1A1AA]' }, `Published on ${new Date(project.createdAt).toLocaleDateString()}`)
        ),
        e('h1', { className: 'text-2xl sm:text-4xl font-extrabold text-white tracking-tight' }, project.title),
        e('p', { className: 'text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-3xl' }, project.description),

        // Progress Velocity
        e(
          'div',
          { className: 'pt-4 space-y-2 border-t border-[#27272A]' },
          e(
            'div',
            { className: 'flex items-center justify-between text-xs text-[#A1A1AA]' },
            e('span', null, 'Milestone Completion Velocity'),
            e('span', { className: 'font-mono font-bold text-white' }, `${project.progress}%`)
          ),
          e(
            'div',
            { className: 'h-2 w-full overflow-hidden rounded-full bg-zinc-800' },
            e('div', { className: 'h-full bg-gradient-to-r from-[#8B5CF6] to-[#10B981] transition-all', style: { width: `${project.progress}%` } })
          )
        )
      ),

      // Hydration Interactive Tab Bar
      e(
        'div',
        { className: 'flex items-center gap-2 border-b border-[#27272A] pb-3' },
        [
          { id: 'tasks', label: `Associated Tasks (${project.tasks?.length || 0})` },
          { id: 'architecture', label: 'Architecture & Tech Stack' },
        ].map((tab) =>
          e(
            'button',
            {
              key: tab.id,
              onClick: () => setActiveTab(tab.id),
              className: `rounded-lg px-4 py-2 text-xs font-medium transition ${
                activeTab === tab.id
                  ? 'bg-[#8B5CF6] text-white shadow-sm'
                  : 'border border-[#27272A] bg-[#18181B] text-[#A1A1AA] hover:bg-zinc-800'
              }`,
            },
            tab.label
          )
        )
      ),

      // Tab Content: Tasks
      activeTab === 'tasks' &&
        e(
          'div',
          { className: 'divide-y divide-[#27272A] rounded-2xl border border-[#27272A] bg-[#18181B] overflow-hidden' },
          (project.tasks || []).map((t, idx) =>
            e(
              'div',
              { key: idx, className: 'flex items-center justify-between p-4 hover:bg-zinc-900/40 transition' },
              e(
                'div',
                { className: 'flex items-center gap-3' },
                e(
                  'span',
                  {
                    className: `h-5 w-5 rounded-md flex items-center justify-center text-xs border ${
                      t.status === 'COMPLETED'
                        ? 'border-[#10B981] bg-[#10B981]/20 text-[#10B981]'
                        : 'border-zinc-700 bg-zinc-900 text-zinc-400'
                    }`,
                  },
                  t.status === 'COMPLETED' ? '✓' : '○'
                ),
                e(
                  'span',
                  { className: `text-xs font-medium ${t.status === 'COMPLETED' ? 'text-[#71717A] line-through' : 'text-white'}` },
                  t.title
                )
              ),
              e(
                'div',
                { className: 'flex items-center gap-2' },
                e('span', { className: 'rounded bg-zinc-900 border border-zinc-700 px-2 py-0.5 text-[10px] text-[#A1A1AA]' }, t.priority),
                e(
                  'span',
                  {
                    className: `rounded px-2 py-0.5 text-[10px] font-semibold ${
                      t.status === 'COMPLETED' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-amber-500/10 text-amber-400'
                    }`,
                  },
                  t.status
                )
              )
            )
          )
        ),

      // Tab Content: Architecture
      activeTab === 'architecture' &&
        e(
          'div',
          { className: 'rounded-2xl border border-[#27272A] bg-[#18181B] p-6 space-y-4' },
          e('h3', { className: 'text-sm font-semibold text-white' }, 'System & Data Flow Details'),
          e(
            'ul',
            { className: 'space-y-2 text-xs text-[#A1A1AA]' },
            e('li', null, '• Database Persistence: PostgreSQL with Prisma ORM foreign key mapping'),
            e('li', null, '• Pre-Rendering Engine: Express ReactDOMServer.renderToString() with initial data serialization'),
            e('li', null, '• Browser Hydration: React hydrateRoot() binding on window.__INITIAL_DATA__')
          )
        )
    )
  );
}

