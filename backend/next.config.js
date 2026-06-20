/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@prisma/client", "@upstash/redis"],
};

module.exports = nextConfig;
