/** @type {import('next').NextConfig} */
const nextConfig = {
  // 生产环境优化
  poweredByHeader: false,
  compress: true,
  generateEtags: false,
  
  // 图片优化
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // 实验性功能
  experimental: {
    scrollRestoration: true,
    // optimizeCss: true, // 暂时禁用，避免critters模块错误
  },

  // 安全头
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
      // API路由缓存头
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      // 静态资源缓存头
      {
        source: '/:path*.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // 重定向
  async redirects() {
    return [
      {
        source: '/old-home',
        destination: '/',
        permanent: true,
      },
    ]
  },

  // 环境变量
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // 构建优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // TypeScript和ESLint配置
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },

  // 输出配置
  output: 'standalone',
  
  // 压缩配置
  compress: true,
  
  // 开发服务器配置
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },
}

module.exports = nextConfig
