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
  experimental: {
    // Ajout de la limite de taille du corps de la requête ici
    serverComponentsExternalPackages: ['sharp'],
  },
}

module.exports = nextConfig 