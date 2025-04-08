import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'npx serve@latest out',
  experimental: {
    // optimizeCss: true,
  },
  devIndicators: {
    appIsrStatus: false,
  },
  // とりあえずデプロイ時に ESLint のエラーを無視
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
