/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Bebas Neue', 'Arial Black', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#00FF87',
          50: '#E6FFF5',
          100: '#CCFFEA',
          200: '#99FFD6',
          300: '#66FFC1',
          400: '#33FFAC',
          500: '#00FF87',
          600: '#00CC6B',
          700: '#00994F',
          800: '#006633',
          900: '#003317'
        },
        secondary: {
          DEFAULT: '#1A1A2E',
          50: '#E8E8ED',
          100: '#D1D1DA',
          200: '#A3A3B5',
          300: '#757590',
          400: '#47476B',
          500: '#1A1A2E',
          600: '#151525',
          700: '#10101B',
          800: '#0A0A12',
          900: '#050509'
        },
        accent: {
          DEFAULT: '#FFD700',
          50: '#FFFEF0',
          100: '#FFFDE0',
          200: '#FFFBC2',
          300: '#FFF8A3',
          400: '#FFF485',
          500: '#FFD700',
          600: '#CCAC00',
          700: '#998100',
          800: '#665600',
          900: '#332B00'
        },
        surface: '#16213E',
        background: '#0F0F1E',
        success: '#00FF87',
        warning: '#FFB800',
        error: '#FF3838',
        info: '#00D4FF'
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 255, 135, 0.3)',
        'neon-strong': '0 0 30px rgba(0, 255, 135, 0.5)',
        'gold': '0 0 20px rgba(255, 215, 0, 0.3)',
        'gold-strong': '0 0 30px rgba(255, 215, 0, 0.5)',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 255, 135, 0.3)' 
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(0, 255, 135, 0.6)' 
          }
        },
        'glow': {
          'from': { 
            textShadow: '0 0 10px rgba(0, 255, 135, 0.8)' 
          },
          'to': { 
            textShadow: '0 0 20px rgba(0, 255, 135, 1)' 
          }
        }
      }
    },
  },
  plugins: [],
}