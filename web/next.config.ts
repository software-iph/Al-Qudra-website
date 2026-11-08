import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server build for the Docker image.
  output: "standalone",
  poweredByHeader: false,
  // Bundled photos, videos and logos rarely change: let browsers keep them for a week.
  async headers() {
    const cache = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }];
    return [
      { source: "/videos/:path*", headers: cache },
      { source: "/images/:path*", headers: cache },
      { source: "/brand/:path*", headers: cache },
    ];
  },
  experimental: {
    serverActions: {
      // Dashboard uploads (videos up to 100 MB) go through Server Actions.
      bodySizeLimit: "110mb",
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
