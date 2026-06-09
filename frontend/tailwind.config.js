/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1a4d2e',
          light: '#2d6a4f',
          dark: '#143d24',
          50: '#f0f5f1',
          100: '#d9e8de',
          200: '#b3d1bc',
          400: '#5a9e6e',
          500: '#2d6a4f',
          600: '#1a4d2e',
          700: '#143d24',
          800: '#0f2e1b',
          900: '#0a1f12',
        },
        gold: {
          DEFAULT: '#c9a84c',
          light: '#e0c56e',
          dark: '#a08a3a',
          50: '#fdf9ee',
          100: '#f8efd0',
          200: '#f0dfa1',
          400: '#d4b45a',
          500: '#c9a84c',
          600: '#b08d3a',
          700: '#8f722e',
          800: '#6e5723',
        },
        cream: {
          DEFAULT: '#faf8f5',
          50: '#fdfcfb',
          100: '#faf8f5',
        },
        charcoal: '#1a1a1a',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'confetti': 'confetti 1s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) rotate(720deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
