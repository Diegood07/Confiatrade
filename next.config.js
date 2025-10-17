/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['mbbernznprzbrwjkbybs.supabase.co'],
  },
  // Optimizaciones para reducir el tamaño del bundle
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Solo aplicar en producción
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 25,
          minSize: 20000,
          maxSize: 24000000, // Mantener chunks bajo 24MB
          cacheGroups: {
            default: false,
            vendors: false,
            commons: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                )[1];
                return `npm.${packageName.replace('@', '')}`;
              },
              chunks: 'all',
            },
            lib: {
              test(module) {
                return module.size() > 160000;
              },
              name(module) {
                return `big-module-${module.id}`;
              },
              chunks: 'all',
              maxSize: 24000000,
            },
          },
        },
      };
    }
    return config;
  },
  experimental: {
    optimizeCss: true, // Optimizar CSS
  },
}

module.exports = nextConfig