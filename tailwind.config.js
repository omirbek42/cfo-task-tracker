/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        priority: {
          critical: '#ef4444',
          high: '#f59e0b',
          medium: '#3b82f6',
          low: '#22c55e',
        },
      },
    },
  },
  plugins: [],
}
