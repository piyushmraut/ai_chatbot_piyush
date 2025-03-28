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
        primary: {
          light: '#536DFE',
          dark: '#3D5AFE',
        },
        secondary: {
          light: '#f3f4f6',
          dark: '#374151',
        },
        botmsg: {
          light: '#EFF6FF',
          dark: '#1E3A8A',
        },
        usermsg: {
          light: '#ECFDF5',
          dark: '#065F46',
        },
      },
      animation: {
        'cursor-blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}