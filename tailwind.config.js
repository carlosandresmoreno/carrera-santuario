/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D6A4F',
          50:  '#E8F5EF',
          100: '#C6E6D5',
          200: '#9FD4B8',
          300: '#78C29B',
          400: '#57B384',
          500: '#2D6A4F',
          600: '#245D44',
          700: '#1B4E38',
          800: '#12402D',
          900: '#0A3020',
        },
        accent: {
          DEFAULT: '#F4A261',
          50:  '#FEF4EC',
          100: '#FCDEC4',
          200: '#FAC79A',
          300: '#F8B070',
          400: '#F4A261',
          500: '#F08030',
          600: '#D96820',
          700: '#B55016',
          800: '#92390E',
          900: '#6E2507',
        },
        dark: {
          DEFAULT: '#0F1A14',
          surface: '#152019',
          card: '#1C2B21',
          border: '#243329',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-green': '0 0 30px rgba(45, 106, 79, 0.4)',
        'glow-accent': '0 0 30px rgba(244, 162, 97, 0.4)',
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [],
};
