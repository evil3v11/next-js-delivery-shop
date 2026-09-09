import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.100", "localhost"],
  images: {
    qualities: [75, 90],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  async rewrites() {
    return [
      {
        source: "/images/products/:path*",
        destination: "/api/uploads/products/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "/api/uploads/:path*",
      },
      {
        source: "/blogCategories/:path*",
        destination: "/api/uploads/article-categories/:path*",
      },
    ];
  },
};

export default nextConfig;
