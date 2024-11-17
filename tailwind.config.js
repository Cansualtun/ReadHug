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
        'custom-sm': '640px',
        'custom-md': '768px',
        'custom-lg': '1024px',
        'custom-xl': '1280px',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
