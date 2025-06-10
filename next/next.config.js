/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'your-strapi-domain.com', 'dev--district-6-strapi.up.railway.app'],
  },
};

module.exports = nextConfig;
