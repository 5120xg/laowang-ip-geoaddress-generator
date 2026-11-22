import type { NextConfig } from "next";

// 整个应用都是客户端渲染，直接静态导出：
// - 可部署到任意静态托管（Cloudflare Pages / Nginx / GitHub Pages）
// - 不再运行 Node 服务端，也就不受 React Server Components 相关漏洞影响
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
