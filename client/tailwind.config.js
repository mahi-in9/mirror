/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        void: '#020408',
        'void-2': '#060c14',
        surface: '#0b1220',
        'surface-2': '#111d30',
        border: '#1a2d4a',
        'border-bright': '#2a4a7a',
        neon: '#4af0c8',
        'neon-2': '#7b6ff0',
        'neon-3': '#f06090',
        muted: '#4a6080',
        'muted-2': '#6080a0',
        bright: '#c0d8f8',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #4af0c8, 0 0 10px #4af0c8' },
          '100%': { boxShadow: '0 0 20px #4af0c8, 0 0 40px #4af0c8, 0 0 80px #4af0c8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
