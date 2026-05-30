import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: isProd ? '/sofia-kantser' : '',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  reactStrictMode: true
};

export default withNextIntl(nextConfig);
