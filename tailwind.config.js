/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          850: '#1f2937', // Custom dark shade for sidebar
        }
      },
      padding: {
        'safe': 'env(safe-area-inset-bottom)',
      }
    }
  },
  plugins: [],
}