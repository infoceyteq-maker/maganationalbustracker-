/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow the Arena live-preview host to load dev assets / HMR
  allowedDevOrigins: ['*.e2b.app'],
};

export default nextConfig;
