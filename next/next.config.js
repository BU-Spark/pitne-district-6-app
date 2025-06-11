/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'your-strapi-domain.com',
      'dev--district-6-strapi.up.railway.app',
      'd6-strapi-bucket.s3.amazonaws.com',
      'd6-strapi-bucket.s3.us-east-1.amazonaws.com',
    ],
  },
};

module.exports = nextConfig;
