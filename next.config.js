/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // App Router já habilitado por padrão no Next 14
  },
}

module.exports = nextConfig;