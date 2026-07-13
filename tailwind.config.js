/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        coffee: {
          DEFAULT: '#6F4E37',
          dark: '#4A342620',
          deep: '#3E2A1E',
        },
        cream: '#F5E6D3',
        sand: '#EFE2D0',
        warm: '#FFFBF7',
        amber: {
          DEFAULT: '#D97706',
          soft: '#F59E0B',
        },
        ink: '#1C1917',
        muted: '#6B6560',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(28,25,23,0.04), 0 8px 24px rgba(28,25,23,0.06)',
      },
    },
  },
  plugins: [],
};
