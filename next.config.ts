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
        hostname: 'cdn.vmst.io',
        port: '',
        pathname: '/accounts/headers/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.vmst.io',
        port: '',
        pathname: '/accounts/avatars/**',
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
