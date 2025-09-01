/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ข้าม ESLint ตอน build
  },
  typescript: {
    ignoreBuildErrors: true, // ข้าม TypeScript errors ตอน build
  },
  output: 'standalone',
}

module.exports = nextConfig