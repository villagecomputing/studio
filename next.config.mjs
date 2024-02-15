/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/data',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
