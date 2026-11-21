/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['sharp'],
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/projects', destination: '/gallery', statusCode: 301 },
      { source: '/projects/:path*', destination: '/gallery', statusCode: 301 },
      { source: '/contact', destination: '/', statusCode: 301 },
      { source: '/contact/:path*', destination: '/', statusCode: 301 },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
