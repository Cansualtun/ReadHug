import { nextui } from '@nextui-org/theme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'var(--font-sans)'],
      },
      container: {
        center: true,
        padding: '2rem',
      },
      screens: {
        '2xl': '1280px',
      },
      maxWidth: {
        'custom-sm': '640px',
        'custom-md': '768px',
        'custom-lg': '1024px',
        'custom-xl': '1280px',
      },
      colors: {
        primary: '#f97316',
      },
      animation: {
        'scale-pulse': 'ringPulse 2s infinite', // mesaj bildirim animasyonu
        fadeindown: 'fade-in-down 0.1s ease-out',
      },
      keyframes: {
        ringPulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.5)' },
          '50%': { boxShadow: '0 0 0 6px rgba(34, 197, 94, 0)' },
          //'100%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.5)' }, 
        },
        "fade-in-down": {
          "0%": {
            opacity: 0,
            transform: "translate3d(0, 0, 0)",
          },
          "100%": {
            opacity: 1,
            transform: "translate3d(0, 0, 0)",
          },
        },
      }

    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
