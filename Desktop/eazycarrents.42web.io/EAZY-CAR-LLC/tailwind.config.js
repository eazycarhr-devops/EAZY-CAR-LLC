/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif']
      },
      colors: {
        brand: {
          black: '#010204',
          blue: '#2563EB',
          green: '#22C55E',
          gray: '#6B7280'
        }
      }
    }
  },
  plugins: []
}
