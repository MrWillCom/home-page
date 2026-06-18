import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**',
      },
      {
        protocol: 'https',
        hostname: 'gts.mrwillcom.com',
        port: '',
        pathname: '/fileserver/**',
      },
      {
        protocol: 'https',
        hostname: 'blog.mrwillcom.com',
        port: '',
        pathname: '/img/**',
      },
    ],
  },
}

export default nextConfig
