import { nextui } from '@nextui-org/theme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      container: {
        center: true,
        padding: '2rem',
      },
      screens: {
        '2xl': '1280px',
      },
      maxWidth: {
        'custom-sm': '640px', // Custom small size
        'custom-md': '768px', // Custom medium size
        'custom-lg': '1024px', // Custom large size
        'custom-xl': '1280px', // Custom extra-large size
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
