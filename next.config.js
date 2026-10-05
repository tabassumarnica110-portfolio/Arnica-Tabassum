/** @type {import('next').NextConfig} */
const nextConfig = {
  // rewrites thakle evabe likhba
  async rewrites() {
    return [
      {
        source: '/(.*)',
        destination: '/',
      },
    ]
  },
}
module.exports = nextConfig
