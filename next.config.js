/** @type {import('next').NextConfig} */
const path = require("path")

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["api.fxcode.ru"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.fxcode.ru",
        port: "",
        pathname: "/assets/**",
      },
    ],
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Instead of aliasing the entire 'react' module, we'll use a more targeted approach
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@radix-ui/react-use-effect-event": path.resolve(__dirname, "./shims/react-use-effect-event.js"),
    }

    return config
  },
}

module.exports = nextConfig
