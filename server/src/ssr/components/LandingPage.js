import React, { useState } from 'react';

const e = React.createElement;

export default function LandingPage({ initialData }) {
  const stats = initialData?.stats || {
    totalProjects: 3,
    totalTasks: 12,
    completedTasks: 8,
    completionRate: 67,
  };

  const publicProjects = initialData?.publicProjects || [];

  // Local state demonstrating client hydration
  const [openFaq, setOpenFaq] = useState(0);
  const [selectedBilling, setSelectedBilling] = useState('monthly');

  const faqs = [
    {
      q: 'How does Server-Side Rendering (SSR) work in DevTrack AI?',
      a: 'When you request this page, the Express server queries PostgreSQL, injects initial statistics, and renders the React component tree into raw HTML using ReactDOMServer.renderToString(). You receive pre-rendered HTML before any client JavaScript executes. React then hydrates the page in your browser.',
    },
    {
      q: 'Why does DevTrack AI use both PostgreSQL and MongoDB?',
      a: 'Polyglot persistence pairs relational data (Users, Projects, Tasks, Payments) with PostgreSQL for ACID guarantees, and polymorphic chat histories with MongoDB for high-velocity schema-free appends.',
    },
    {
      q: 'How does the local Ollama AI integration function?',
      a: 'Inference requests pass from the UI to our Express API, which proxies prompts to a local Ollama daemon on localhost:11434. No cloud API keys or external subscription costs are incurred.',
    },
    {
      q: 'How does Razorpay payment verification ensure security?',
      a: 'Payment success is never trusted from the client. The Express backend recalculates the HMAC-SHA256 signature using the secret key and order_id|payment_id. Only verified signatures activate user subscriptions.',
    },
  ];

  return e(
    'div',
    { className: 'min-h-screen bg-[#09090B] text-[#F4F4F5] font-sans antialiased' },

    // Navigation Bar
    e(
      'header',
      { className: 'sticky top-0 z-40 border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-md px-6 py-4' },
      e(
        'div',
        { className: 'mx-auto flex max-w-7xl items-center justify-between' },
        e(
          'a',
          { href: '/', className: 'flex items-center gap-2.5 text-base font-bold tracking-tight text-white' },
          e(
            'div',
            { className: 'flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-white shadow-md shadow-[#8B5CF6]/20 font-mono text-sm' },
            '>_'
          ),
          e('span', null, 'DevTrack'),
          e('span', { className: 'rounded bg-[#8B5CF6]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[#A78BFA]' }, 'AI')
        ),
        e(
          'nav',
          { className: 'hidden md:flex items-center gap-6 text-xs text-[#A1A1AA]' },
          e('a', { href: '/explore', className: 'hover:text-white transition' }, 'Public Projects'),
          e('a', { href: '#features', className: 'hover:text-white transition' }, 'Features'),
          e('a', { href: '#faq', className: 'hover:text-white transition' }, 'Architecture FAQ'),
          e('a', { href: '/pricing', className: 'hover:text-white transition text-[#A78BFA] font-medium' }, 'Pricing')
        ),
        e(
          'div',
          { className: 'flex items-center gap-3' },
          e(
            'a',
            { href: '/login', className: 'rounded-lg border border-[#27272A] bg-[#18181B] px-3.5 py-1.5 text-xs font-medium text-[#F4F4F5] hover:border-zinc-700 transition' },
            'Sign In'
          ),
          e(
            'a',
            { href: '/register', className: 'rounded-lg bg-[#8B5CF6] px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-[#7C3AED] transition' },
            'Launch App'
          )
        )
      )
    ),

    // Hero Section
    e(
      'section',
      { className: 'relative overflow-hidden px-6 pt-16 pb-20 text-center lg:pt-24' },
      e(
        'div',
        { className: 'mx-auto max-w-4xl space-y-6' },
        e(
          'div',
          { className: 'inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-3 py-1 text-xs font-medium text-[#A78BFA]' },
          e('span', { className: 'h-2 w-2 rounded-full bg-[#10B981] animate-pulse' }),
          'DevTrack AI v1.2 — Server-Side Rendered (SSR) Edition'
        ),
        e(
          'h1',
          { className: 'text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight' },
          'The AI-Powered Developer Workspace Engineered for ',
          e('span', { className: 'text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#3B82F6]' }, 'Software Engineering Students')
        ),
        e(
          'p',
          { className: 'mx-auto max-w-2xl text-xs sm:text-base text-[#A1A1AA] leading-relaxed' },
          'Track milestones with PostgreSQL, consult local Ollama AI mentors with zero cloud fees, master JavaScript runtime mechanics, and subscribe with Razorpay test mode.'
        ),
        e(
          'div',
          { className: 'flex flex-wrap items-center justify-center gap-3 pt-4' },
          e(
            'a',
            { href: '/register', className: 'inline-flex items-center gap-2 rounded-xl bg-[#8B5CF6] px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-[#8B5CF6]/25 hover:bg-[#7C3AED] transition transform hover:-translate-y-0.5' },
            'Start Free Workspace'
          ),
          e(
            'a',
            { href: '/explore', className: 'inline-flex items-center gap-2 rounded-xl border border-[#27272A] bg-[#18181B] px-5 py-3 text-xs sm:text-sm font-medium text-white hover:border-zinc-700 transition' },
            'Explore Public Showcase'
          )
        )
      )
    ),

    // Live Server-Rendered Metrics Banner
    e(
      'section',
      { className: 'border-y border-[#27272A] bg-[#111113] px-6 py-8' },
      e(
        'div',
        { className: 'mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4 gap-6 text-center' },
        e(
          'div',
          { className: 'space-y-1' },
          e('p', { className: 'text-[11px] uppercase tracking-wider text-[#A1A1AA] font-semibold' }, 'Hosted Projects'),
          e('h3', { className: 'text-2xl sm:text-3xl font-extrabold text-[#F4F4F5] font-mono' }, stats.totalProjects),
          e('p', { className: 'text-[10px] text-[#71717A]' }, 'Queried from PostgreSQL via SSR')
        ),
        e(
          'div',
          { className: 'space-y-1' },
          e('p', { className: 'text-[11px] uppercase tracking-wider text-[#A1A1AA] font-semibold' }, 'Tasks Tracked'),
          e('h3', { className: 'text-2xl sm:text-3xl font-extrabold text-[#3B82F6] font-mono' }, stats.totalTasks),
          e('p', { className: 'text-[10px] text-[#71717A]' }, 'With Foreign Key Cascades')
        ),
        e(
          'div',
          { className: 'space-y-1' },
          e('p', { className: 'text-[11px] uppercase tracking-wider text-[#A1A1AA] font-semibold' }, 'Tasks Completed'),
          e('h3', { className: 'text-2xl sm:text-3xl font-extrabold text-[#10B981] font-mono' }, stats.completedTasks),
          e('p', { className: 'text-[10px] text-[#71717A]' }, 'Active milestone progress')
        ),
        e(
          'div',
          { className: 'space-y-1' },
          e('p', { className: 'text-[11px] uppercase tracking-wider text-[#A1A1AA] font-semibold' }, 'Platform Velocity'),
          e('h3', { className: 'text-2xl sm:text-3xl font-extrabold text-[#8B5CF6] font-mono' }, `${stats.completionRate}%`),
          e('p', { className: 'text-[10px] text-[#71717A]' }, 'Calculated server-side before render')
        )
      )
    ),

    // Core Pillars Section
    e(
      'section',
      { id: 'features', className: 'px-6 py-20 max-w-7xl mx-auto' },
      e(
        'div',
        { className: 'text-center space-y-2 mb-12' },
        e('span', { className: 'text-xs font-semibold uppercase tracking-wider text-[#8B5CF6]' }, 'Full-Stack Architecture'),
        e('h2', { className: 'text-2xl sm:text-3xl font-bold text-white' }, 'Four Pillars of DevTrack AI'),
        e('p', { className: 'text-xs sm:text-sm text-[#A1A1AA]' }, 'Every capability engineered to reflect industry standard patterns.')
      ),
      e(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' },
        [
          {
            title: 'Polyglot Persistence',
            desc: 'PostgreSQL with Prisma ORM for relational tables, paired with MongoDB Mongoose for AI chat threads.',
            tag: 'Postgres + Mongo',
            color: 'border-[#8B5CF6]/30 bg-[#8B5CF6]/5',
          },
          {
            title: 'Local Ollama AI',
            desc: 'Zero-cloud, privacy-preserving LLM inference using llama3.2 on localhost:11434 proxied via Express.',
            tag: 'Local LLM',
            color: 'border-[#3B82F6]/30 bg-[#3B82F6]/5',
          },
          {
            title: 'JavaScript CS Lab',
            desc: 'Interactive runtime sandboxes for Closures, Event Loop microtasks, Hoisting, and Promises vs async/await.',
            tag: 'Core JS',
            color: 'border-[#10B981]/30 bg-[#10B981]/5',
          },
          {
            title: 'Razorpay Subscriptions',
            desc: 'Free, Pro (₹149), and Premium (₹299) plans with server-side HMAC-SHA256 signature verification.',
            tag: 'Payments',
            color: 'border-amber-500/30 bg-amber-500/5',
          },
        ].map((feat, i) =>
          e(
            'div',
            { key: i, className: `rounded-2xl border p-6 space-y-3 ${feat.color}` },
            e('span', { className: 'inline-block rounded-full bg-zinc-900 border border-zinc-700 px-2 py-0.5 text-[10px] font-semibold text-zinc-300' }, feat.tag),
            e('h3', { className: 'text-base font-semibold text-white' }, feat.title),
            e('p', { className: 'text-xs text-[#A1A1AA] leading-relaxed' }, feat.desc)
          )
        )
      )
    ),

    // Pricing Teaser Section
    e(
      'section',
      { className: 'px-6 py-16 bg-[#111113] border-t border-[#27272A]' },
      e(
        'div',
        { className: 'max-w-5xl mx-auto space-y-8 text-center' },
        e(
          'div',
          { className: 'space-y-2' },
          e('h2', { className: 'text-2xl sm:text-3xl font-bold text-white' }, 'Transparent Subscription Tiers'),
          e('p', { className: 'text-xs text-[#A1A1AA]' }, 'Integrated with Razorpay Test Mode for instant sandbox checkout.')
        ),
        e(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-3 gap-6 text-left' },
          [
            { name: 'Free Plan', price: '₹0', badge: 'Active Default', features: ['3 Active Projects', '25 Tasks per project', 'Standard JS Playground', 'Community Support'] },
            { name: 'Pro Plan', price: '₹149', badge: 'Most Popular', highlight: true, features: ['Unlimited Projects & Tasks', 'Ollama AI Priority Acceleration', 'Advanced CS Architecture Labs', 'Priority Email & Viva Support'] },
            { name: 'Premium Plan', price: '₹299', badge: 'Full Mastery', features: ['Everything in Pro Plan', '1-on-1 Code Review Simulator', 'Docker & Kubernetes Sandboxes', 'DevTrack Certified Engineer Badge'] },
          ].map((plan, idx) =>
            e(
              'div',
              {
                key: idx,
                className: `rounded-2xl border p-6 flex flex-col justify-between ${
                  plan.highlight
                    ? 'border-[#8B5CF6] bg-[#18181B] shadow-xl shadow-[#8B5CF6]/10 ring-1 ring-[#8B5CF6]'
                    : 'border-[#27272A] bg-[#18181B]'
                }`,
              },
              e(
                'div',
                { className: 'space-y-4' },
                e(
                  'div',
                  { className: 'flex items-center justify-between' },
                  e('h3', { className: 'text-base font-bold text-white' }, plan.name),
                  e('span', { className: 'rounded-full bg-zinc-800 px-2.5 py-0.5 text-[10px] font-semibold text-[#A78BFA]' }, plan.badge)
                ),
                e(
                  'div',
                  { className: 'flex items-baseline gap-1' },
                  e('span', { className: 'text-3xl font-extrabold text-white font-mono' }, plan.price),
                  e('span', { className: 'text-xs text-[#A1A1AA]' }, '/month')
                ),
                e(
                  'ul',
                  { className: 'space-y-2 pt-2 border-t border-[#27272A] text-xs text-[#A1A1AA]' },
                  plan.features.map((f, fi) =>
                    e('li', { key: fi, className: 'flex items-center gap-2' }, e('span', { className: 'text-[#10B981]' }, '✔'), f)
                  )
                )
              ),
              e(
                'a',
                {
                  href: '/pricing',
                  className: `mt-6 block text-center rounded-xl py-2.5 text-xs font-semibold transition ${
                    plan.highlight
                      ? 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED]'
                      : 'border border-[#27272A] bg-zinc-900 text-white hover:bg-zinc-800'
                  }`,
                },
                plan.price === '₹0' ? 'Get Started' : 'Subscribe via Razorpay'
              )
            )
          )
        )
      )
    ),

    // Interactive FAQ Accordion (Demonstrates Client Hydration)
    e(
      'section',
      { id: 'faq', className: 'px-6 py-20 max-w-4xl mx-auto' },
      e(
        'div',
        { className: 'text-center space-y-2 mb-10' },
        e('span', { className: 'text-xs font-semibold uppercase tracking-wider text-[#8B5CF6]' }, 'Technical Viva Review'),
        e('h2', { className: 'text-2xl sm:text-3xl font-bold text-white' }, 'Frequently Asked Architecture Questions'),
        e('p', { className: 'text-xs text-[#A1A1AA]' }, 'This accordion hydrates on the client: click any question to inspect dynamic React state!')
      ),
      e(
        'div',
        { className: 'space-y-3' },
        faqs.map((faq, idx) =>
          e(
            'div',
            { key: idx, className: 'rounded-xl border border-[#27272A] bg-[#18181B] overflow-hidden' },
            e(
              'button',
              {
                onClick: () => setOpenFaq(openFaq === idx ? -1 : idx),
                className: 'flex w-full items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-white hover:bg-zinc-800/40 transition',
              },
              e('span', null, faq.q),
              e('span', { className: 'text-base font-mono text-[#8B5CF6] ml-2' }, openFaq === idx ? '−' : '+')
            ),
            openFaq === idx &&
              e('div', { className: 'p-4 pt-0 text-xs text-[#A1A1AA] leading-relaxed border-t border-[#27272A]/50 bg-zinc-950/40' }, faq.a)
          )
        )
      )
    ),

    // Footer
    e(
      'footer',
      { className: 'border-t border-[#27272A] bg-[#09090B] px-6 py-10 text-xs text-[#71717A]' },
      e(
        'div',
        { className: 'mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4' },
        e('p', null, '© 2026 DevTrack AI — Full-Stack Engineering Platform. MIT Licensed.'),
        e(
          'div',
          { className: 'flex items-center gap-4 text-[#A1A1AA]' },
          e('a', { href: '/explore', className: 'hover:text-white' }, 'Public Projects'),
          e('a', { href: '/pricing', className: 'hover:text-white' }, 'Plans & Pricing'),
          e('a', { href: 'https://github.com/Avenash005/Dev-Track', target: '_blank', className: 'hover:text-white' }, 'GitHub Repo')
        )
      )
    )
  );
}

