/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',   // 🔥 ye line add karo

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "#0b0e11",
      }
    },
  },

  plugins: [],
}