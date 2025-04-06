/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'], // If we decide to use Cloudinary later
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.stability.ai',
      },
    ],
    // Allow larger images and disable optimization for AI-generated content
    unoptimized: true,
  },
  // Important: Allow images of any size to be processed by the API
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig 