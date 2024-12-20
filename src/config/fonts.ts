import {
  Poppins as FontSans,
  Fira_Code as FontMono,
  Just_Another_Hand,
  Caveat,
  Courgette,
} from 'next/font/google';

export const fontSans = FontSans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
});
export const caveat = Caveat({
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  subsets: ['latin', 'cyrillic', 'cyrillic-ext', 'latin-ext'],
  variable: '--font-hand',
});
export const courgette = Courgette({
  weight: ['400'],
  display: 'swap',
  subsets: ['latin', 'latin-ext'],
  variable: '--font-hand2',
});
