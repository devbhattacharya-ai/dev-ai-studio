import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/work/bisi-bele", destination: "/work/rowdy-momo", permanent: true }];
  },
  async headers() {
    const studioHeaders = [
      { key: "Cache-Control", value: "private, no-store" },
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
    ];
    return [
      { source: "/studio", headers: studioHeaders },
      { source: "/studio/:path*", headers: studioHeaders },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
