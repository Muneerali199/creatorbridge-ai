/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: ["@prisma/client", "@upstash/redis"],
};

module.exports = nextConfig;
