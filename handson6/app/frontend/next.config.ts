import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  experimental: {
    // optimizeCss: true,
  },
  devIndicators: {
    appIsrStatus: false,
  },
  // とりあえずデプロイ時に ESLint のエラーを無視
  eslint: {
    ignoreDuringBuilds: true,
  },
  // リダイレクト設定を追加
  async redirects() {
    return [
      {
        source: '/',
        destination: '/user',
        permanent: true,
      },
    ]
  }
};

export default nextConfig;
