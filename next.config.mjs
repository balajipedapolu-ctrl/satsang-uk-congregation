/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep production builds resilient — we lint separately during development.
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
