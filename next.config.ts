/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
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
