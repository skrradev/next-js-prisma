import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals = [
      ...(config.externals || []),
      {
        "utf-8-validate": "commonjs utf-8-validate",
        bufferutil: "commonjs bufferutil",
      },
    ];
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/socket",
        destination: "/api/socket",
      },
    ];
  },
};

export default nextConfig;
