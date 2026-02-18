import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
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
    ],
  },
}

export default nextConfig
