/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/data',
        permanent: true,
      },
      {
        source: '/group',
        destination: '/experiment',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
