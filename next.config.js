/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {},
  reactStrictMode: true,
  swcMinify: true,
  experimental: {},
  eslint: {
    dirs: ['app'],
  },
  images: {
    domains: ['images.unsplash.com', 'picsum.photos', 'static.wixstatic.com'],
    formats: ['image/webp'],
  },
};

module.exports = nextConfig;
