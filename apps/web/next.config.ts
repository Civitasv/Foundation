import type { NextConfig } from "next";

const pagesBasePath = process.env.PAGES_BASE_PATH;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(pagesBasePath ? { basePath: pagesBasePath } : {}),
  images: {
    unoptimized: true
  },
  transpilePackages: ["@foundation/knowledge", "next-mdx-remote"]
};

export default nextConfig;
