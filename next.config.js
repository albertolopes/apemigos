/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  env: {},
  reactStrictMode: true,
  experimental: {},
  eslint: {
    dirs: ['app'],
  },
  images: {
    domains: [
      'images.unsplash.com',
      'picsum.photos',
      'static.wixstatic.com',
      'i.imgur.com',
    ],
    formats: ['image/webp'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@services': path.resolve(__dirname, 'services'),
      '@services/*': path.resolve(__dirname, 'services'),
      '@app': path.resolve(__dirname, 'app'),
      '@statics': path.resolve(__dirname, 'public'),
    };
    return config;
  },
};

module.exports = nextConfig;
