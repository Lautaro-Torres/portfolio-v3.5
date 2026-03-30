/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'three'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Optimize Three.js bundle
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'three': 'three',
      };
    }
    return config;
  },
};

export default nextConfig;
