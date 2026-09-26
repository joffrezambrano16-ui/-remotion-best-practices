import type { Config } from 'tailwindcss'

// Paleta de marca FruitsIsland. Cambia estos colores y toda la tienda se actualiza.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: '#EEF8F1',
          100: '#D6EFDD',
          200: '#A8DDB5',
          400: '#3FAE62',
          500: '#2F8F4E',
          600: '#25763F',
          700: '#1E6B38',
          900: '#123D22',
        },
        mango: {
          100: '#FFF3CF',
          300: '#FFD66B',
          400: '#FFC23D',
          500: '#F5A91A',
        },
        coral: {
          100: '#FFE6DD',
          300: '#FFB199',
          400: '#FF7A59',
          500: '#F25F3A',
          600: '#D94A26',
          700: '#A93819',
        },
        sand: {
          50: '#FFFCF6',
          100: '#FFF8EC',
          200: '#FDEBCB',
          300: '#F3DDB5',
        },
        ink: '#1F2A24',
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-rounded', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(31, 42, 36, 0.18)',
      },
      keyframes: {
        'slide-in': { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        'slide-in': 'slide-in 0.25s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
