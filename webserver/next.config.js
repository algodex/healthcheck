/** @type {import('next').NextConfig} */


const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/data',
          destination: process.env.COUCH_PROXY,
        },
      ]
    }
  },
}

module.exports = nextConfig;

