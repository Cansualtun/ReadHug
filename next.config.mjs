/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  images: {
    domains: ['i.dr.com.tr', 'i.idefix.com'],
  },
};

export default withNextIntl(nextConfig);
