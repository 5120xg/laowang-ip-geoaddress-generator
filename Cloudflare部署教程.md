# Cloudflare Pages 部署教程

本项目已改为**纯静态导出**，不再需要 Node.js 运行时，也不需要 `nodejs_compat` 兼容性标志。

## 1. Fork 项目仓库

1. 访问 [GuooGaii/ip-geoaddress-generator](https://github.com/GuooGaii/ip-geoaddress-generator)
2. 点击右上角的 "Fork" 按钮创建你自己的副本

## 2. 在 Cloudflare 中部署

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)，进入 "Workers 和 Pages" → "Pages"
2. 点击 "连接到 Git"，关联 GitHub 账号并选择 fork 的仓库
3. 构建配置：
   - 框架预设：`Next.js (Static HTML Export)`（或选 "无"）
   - 构建命令：`npm run build`
   - 构建输出目录：`out`
   - 环境变量（可选）：`NODE_VERSION` = `20`
4. 点击 "保存并部署"，完成后访问分配的域名即可

> 如果是从旧版本升级：请把项目设置里的构建输出目录改为 `out`，并可以删除 `nodejs_compat` 标志。
