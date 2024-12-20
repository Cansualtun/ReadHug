import '@/styles/globals.css';
import '@/styles/special.scrollbar.css';
import { Metadata, Viewport } from 'next';
import clsx from 'clsx';
import React from 'react';
import { Providers } from '../providers';
import { Toaster } from 'sonner';
import { siteConfig } from '@/config/site';
import { fontSans, caveat, courgette } from '@/config/fonts';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Header from '../components/ui/navbar';
import FloatingMessageWidget from '../components/ui/widget/FloatingMessageWidget';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/assets/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <NextIntlClientProvider messages={messages}>
        <body
          className={clsx(
            'min-h-screen font-sans antialiased',
            fontSans.variable,
            caveat.variable,
            courgette.variable,
          )}
        >
          <Providers themeProps={{ attribute: 'class' }}>
            <Toaster position="top-center" />
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 container mx-auto py-10">
                <div className="mb-auto ">{children}</div>
              </main>
            </div>
            <FloatingMessageWidget />
          </Providers>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
