/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx,jsx}"],
  theme: {
    extend: {
      colors: {
        bunker: {
          50: "#f6f7f9",
          100: "#ededf1",
          200: "#d6d8e1",
          300: "#b3b8c6",
          400: "#8a92a6",
          500: "#6b748c",
          600: "#565c73",
          700: "#464b5e",
          800: "#3d414f",
          900: "#363944",
          910: "#292a32",
          920: "#262730",
          950: "#16171c",
        },
      },
    },
  },
  darkMode: ["class"],
  plugins: [],
};
