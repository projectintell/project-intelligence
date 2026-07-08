/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions body size limit raised for document uploads
  // (Claim Score / Claims Intelligence document ingestion).
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb',
    },
  },
};

module.exports = nextConfig;
