/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        mint: '#7ecfb3',
        dark: '#0a0e1a',
        ink: '#1a0a2e',
        cream: '#f5f0e8',
      }
    },
  },
  plugins: [],
}
