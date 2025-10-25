/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    typedRoutes: false,
    typeScriptWorkers: false,
  },

  // 👇 Adicione estas opções aqui:
  output: 'standalone',
  dynamic: 'force-dynamic',
  fetchCache: 'force-no-store',
  revalidate: 0,
};

export default nextConfig;
