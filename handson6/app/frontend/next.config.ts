import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  optimizeFonts: false,
  experimental: {
    optimizeCss: true,
  },
  devIndicators: {
    appIsrStatus: false,
  },
};

export default nextConfig;
