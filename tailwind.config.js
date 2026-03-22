/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mclaren: ['McLaren', 'serif'],
        montserrat: ['Montserrat', 'serif']
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}