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
  // リダイレクトを削除し、デフォルトページを設定
  trailingSlash: true,
  // 静的エクスポート時にindex.htmlを生成
  generateIndexPages: true
};

export default nextConfig;
