/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a'
        },
        accent: {
          500: '#8b5cf6',
          600: '#7c3aed'
        },
        surface: '#ffffff',
        background: '#0f0f23',
        card: '#1a1a2e',
        text: {
          primary: '#ffffff',
          secondary: '#94a3b8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0,0,0,0.08)',
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)'
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px'
      }
    },
  },
  plugins: [],
}