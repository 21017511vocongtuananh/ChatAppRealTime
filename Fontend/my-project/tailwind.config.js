/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-blue-light': '#005AE0',
        'custom-blue-dark': '#0043A8'
      }
    }
  },
  plugins: []
};
