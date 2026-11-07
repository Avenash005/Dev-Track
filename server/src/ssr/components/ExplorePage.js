import React from 'react';

const e = React.createElement;

export default function ExplorePage({ initialData }) {
  const projects = initialData?.projects || [];

  return e(
    'div',
    { className: 'min-h-screen bg-[#09090B] text-[#F4F4F5] font-sans antialiased' },

    // Header
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
          'Home'
        ),
        e(
          'div',
          { className: 'flex items-center gap-3' },
          e('a', { href: '/login', className: 'text-xs text-[#A1A1AA] hover:text-white' }, 'Sign In'),
          e('a', { href: '/register', className: 'rounded-lg bg-[#8B5CF6] px-3.5 py-1 text-xs text-white' }, 'Sign Up')
        )
      )
    ),

    // Showcase
    e(
      'main',
      { className: 'mx-auto max-w-7xl px-6 py-12 space-y-8' },
      e(
        'div',
        { className: 'space-y-2' },
        e('span', { className: 'rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 px-3 py-1 text-xs font-semibold text-[#A78BFA]' }, 'Server-Side Rendered Showcase'),
        e('h1', { className: 'text-3xl font-extrabold text-white tracking-tight' }, 'Explore Public Engineering Projects'),
        e('p', { className: 'text-xs sm:text-sm text-[#A1A1AA]' }, 'Inspect student software engineering repositories, architecture scopes, and milestone velocity.')
      ),

      // Project Cards Grid
      e(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' },
        projects.map((proj) =>
          e(
            'div',
            { key: proj.id, className: 'rounded-2xl border border-[#27272A] bg-[#18181B] p-6 flex flex-col justify-between hover:border-zinc-700 transition' },
            e(
              'div',
              { className: 'space-y-3' },
              e(
                'div',
                { className: 'flex items-center justify-between' },
                e('span', { className: 'rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 px-2.5 py-0.5 text-[10px] font-semibold text-[#A78BFA]' }, proj.status || 'PLANNING'),
                e('span', { className: 'text-[11px] text-[#71717A]' }, `${proj.totalTasks || 0} tasks`)
              ),
              e('h3', { className: 'text-base font-bold text-white' }, proj.title),
              e('p', { className: 'text-xs text-[#A1A1AA] line-clamp-2' }, proj.description || 'No description provided.')
            ),
            e(
              'div',
              { className: 'mt-6 pt-4 border-t border-[#27272A] space-y-3' },
              e(
                'div',
                { className: 'space-y-1' },
                e(
                  'div',
                  { className: 'flex justify-between text-xs text-[#A1A1AA]' },
                  e('span', null, 'Completion'),
                  e('span', { className: 'font-mono text-white' }, `${proj.progress || 0}%`)
                ),
                e(
                  'div',
                  { className: 'h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden' },
                  e('div', { className: 'h-full bg-[#8B5CF6]', style: { width: `${proj.progress || 0}%` } })
                )
              ),
              e(
                'a',
                {
                  href: `/p/${proj.id}`,
                  className: 'block text-center rounded-lg border border-[#27272A] bg-zinc-900 py-1.5 text-xs text-white hover:bg-zinc-800 transition font-medium',
                },
                'View SSR Project Details →'
              )
            )
          )
        )
      )
    )
  );
}
