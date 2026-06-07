/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        navy: {
          950: '#080f22',
          900: '#0f1b3d',
          800: '#16254f',
        },
        gold: {
          50: '#fff7e7',
          500: '#c8a96b',
          600: '#b8902a',
        },
      },
    },
  },

  plugins: [],
};