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
    domains: ["api.fxcode.ru", "api.tirebase.ru", "hebbkx1anhila5yf.public.blob.vercel-storage.com", "duplo-s0.shinservice.ru", "diskoptim.ru", "s3.ru1.storage.beget.cloud"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.fxcode.ru",
        port: "",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "api.tirebase.ru",
        port: "",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "duplo-s0.shinservice.ru",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "diskoptim.ru",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.ru1.storage.beget.cloud",
        port: "",
        pathname: "/**",
      },
    ],
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
