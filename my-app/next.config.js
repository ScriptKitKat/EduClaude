/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Keep TypeScript checking enabled (only disable for warnings)
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
