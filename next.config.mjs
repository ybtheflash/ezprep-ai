/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: {
        allowedOrigins: [
          'localhost:3000',
          'fictional-doodle-j9vg6rjg46whjq-3000.app.github.dev',
          'https://fictional-doodle-j9vg6rjg46whjq-3000.app.github.dev/'
        ],
        allowedForwardedHosts: [
          'https://fictional-doodle-j9vg6rjg46whjq-3000.app.github.dev/',
          'fictional-doodle-j9vg6rjg46whjq-3000.app.github.dev'
        ]
      }
    }
  }
  
  export default nextConfig;
  