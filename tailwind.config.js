/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        'custom-green': '#18a058',
        'main-bg': '#18181c'
      }
    }
  },
  plugins: []
}
