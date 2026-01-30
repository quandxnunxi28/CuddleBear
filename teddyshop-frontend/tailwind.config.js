/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f6ff',
          100: '#f3ecff',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        rose: {
          50: '#fff5f7',
          100: '#ffe4ec',
          500: '#f43f5e',
          600: '#e11d48',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
