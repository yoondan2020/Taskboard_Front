/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,css}",
    ],
    theme: {
    extend: {
      colors: {
        primary: '#005D73',
      },
    },
  },
    plugins: [],
};
