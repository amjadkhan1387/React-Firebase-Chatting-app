/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      backgroundColor: {
        'themeIndigo': '#6200a9',
      
      },
      colors: {
        'themeIndigo': '#6200a9',

      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
