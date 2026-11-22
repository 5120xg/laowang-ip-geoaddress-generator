# 优化说明

## 安全
- 升级 Next.js 15.3.0 → ^15.5.9、React 19.1.0 → ^19.2.3（修复 React2Shell 等 RSC 远程代码执行漏洞），axios → ^1.12.0
- 改为 `output: "export"` 纯静态站点，不再运行 Node 服务端
- 收件箱邮件 HTML 改为放进 `sandbox` iframe 渲染（禁脚本、隔离源），修复 XSS
- Docker 运行阶段改为非 root 的 nginx-unprivileged

## 功能修复
- 手动输入的 IP 现在真正生效（之前始终用本机 IP）
- 地址真正随机：在 IP/地区坐标附近随机偏移后反查，无街道时自动重试（遵守 Nominatim 1 次/秒）
- 切换 IP / 地址模式不再串用旧坐标
- 每次生成前清空错误；错误信息更友好（限流、超时、网络错误）
- 历史记录：修复刷新/StrictMode 下被空数组覆盖；收藏记录不会被 20 条上限挤掉；数据格式校验
- 去掉渲染期 `effect()` 订阅泄漏（移除 preact signals，统一用 React state + react-query）
- 临时邮箱失败/变慢不再卡住"生成地址"按钮
- 手机端可用：左侧输入区与历史不再隐藏，布局响应式
- 地区选择器改为点击打开（支持触屏），输入框只读；地区数据按需加载并缓存
- Toast 计时器不再被重渲染重置
- 主题切换使用 resolvedTheme，修复跟随系统时图标错误和水合警告

## 体验
- 街道包含门牌号；城市按 city → town → village 回退
- 随机用户国籍跟随 IP 所在国家（randomuser 不支持的国家回退 US），证件号字段按国家显示
- 新增"完整地址"一键复制；非 HTTPS 下复制回退
- 历史列表显示城市；删除全部需确认；收信箱图标显示邮件数量
- IP 输入框支持回车生成、格式校验

## 工程
- 合并重复的 service，删除 signals / 未使用代码，`ThemeWarpper` → `ThemeWrapper`
- 显式声明 `@radix-ui/react-popover` 依赖，eslint-config-next 与 next 版本对齐
- GitHub Action 增加 `permissions: contents: write`，合并失败时不再 push
- 修正 README（`npm run dev`、端口 5000、导出格式）与 Cloudflare 部署教程

> 注意：已删除过期的 package-lock.json，请首次执行 `npm install` 重新生成并提交。
