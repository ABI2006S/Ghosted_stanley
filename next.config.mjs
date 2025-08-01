/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Netlify
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Configure trailing slash
  trailingSlash: true,
  
  // Optimize for static hosting
  distDir: 'out',
  
  // Enhanced webpack configuration
  webpack: (config, { isServer, dev }) => {
    // Handle audio files with proper MIME types
    config.module.rules.push({
      test: /\.(mp3|wav|ogg|m4a|aac|flac)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/audio/[name].[hash:8][ext]',
      },
    })
    
    // Handle other media files
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif|svg|webp|avif)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/images/[name].[hash:8][ext]',
      },
    })
    
    // Optimize for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
      }
    }
    
    // Enhanced bundle optimization
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
          },
        },
      },
      usedExports: true,
      sideEffects: false,
    }
    
    // Reduce bundle size in production
    if (!dev) {
      config.optimization.minimize = true
    }
    
    return config
  },
  
  // Enhanced compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: 'stanleys-desktop-1998',
    AUDIO_BASE_PATH: '/audio',
    BUILD_TIME: new Date().toISOString(),
  },
  
  // Build optimizations
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: false, // Enable for better error catching
  },

  // Disable powered by header
  poweredByHeader: false,

  // Optimize bundle
  swcMinify: true,

  // Enhanced experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },

  // Enhanced headers for better caching
  async headers() {
    return [
      {
        source: '/audio/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Accept-Ranges',
            value: 'bytes',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

export default nextConfig
