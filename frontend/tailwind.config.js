/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f1effe',
          100: '#e5e1fd',
          200: '#ccc4fb',
          300: '#ab9ef6',
          400: '#8b78ef',
          500: '#6f57e8',
          600: '#5b4be6',
          700: '#4b3ccc',
          800: '#3d33a3',
          900: '#342e80',
        },
        accent: {
          400: '#ff7aa2',
          500: '#ff5c8a',
          600: '#ec3f72',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
