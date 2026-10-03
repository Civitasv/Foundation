import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: process.env.PAGES_BASE_PATH,
  images: {
    unoptimized: true
  },
  transpilePackages: ["@foundation/knowledge"]
};

export default nextConfig;
