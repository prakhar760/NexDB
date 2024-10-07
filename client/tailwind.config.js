/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6200EE',
          light: '#7C4DFF',
          dark: '#3700B3',
        },
        secondary: {
          DEFAULT: '#03DAC5',
          light: '#64FFDA',
          dark: '#018786',
        },
        background: {
          DEFAULT: '#121212',
          light: '#1E1E1E',
          lighter: '#2C2C2C',
        },
        surface: '#1E1E1E',
        text: {
          primary: '#E0E0E0',
          secondary: '#A0A0A0',
        },
        error: '#CF6679',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
