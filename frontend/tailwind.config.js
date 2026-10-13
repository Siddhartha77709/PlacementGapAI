/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#1E3A8A'
        },
        royal: '#2563EB',
        cyan: '#06B6D4',
        emerald: '#10B981',
        missing: '#EF4444',
        weak: '#F59E0B',
        canvas: '#F8FAFC',
        surface: '#FFFFFF',
        border: '#CBD5E1'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
