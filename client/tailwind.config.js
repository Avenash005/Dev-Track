/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#09090B',
        sidebar: '#111113',
        card: '#18181B',
        border: '#27272A',
        primary: {
          DEFAULT: '#8B5CF6',
          hover: '#7C3AED',
          light: '#A78BFA',
          subtle: 'rgba(139, 92, 246, 0.1)',
        },
        secondary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          light: '#60A5FA',
          subtle: 'rgba(59, 130, 246, 0.1)',
        },
        success: {
          DEFAULT: '#10B981',
          hover: '#059669',
          subtle: 'rgba(16, 185, 129, 0.1)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          subtle: 'rgba(245, 158, 11, 0.1)',
        },
        danger: {
          DEFAULT: '#EF4444',
          subtle: 'rgba(239, 68, 68, 0.1)',
        },
        text: {
          primary: '#F4F4F5',
          secondary: '#A1A1AA',
          muted: '#71717A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
