export const defaultLocale = 'tr';
export const locales = ['tr', 'en'] as const;
export const localePrefix = 'always';

export type Locale = (typeof locales)[number];
