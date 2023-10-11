const withTwin = require('./withTwin.js');

/** @type {import('next').NextConfig} */
const nextConfig = withTwin({
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
});

module.exports = nextConfig;
