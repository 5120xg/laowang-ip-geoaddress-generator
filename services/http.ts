import axios from "axios";

export const http = axios.create({ timeout: 10_000 });

export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/** 把各种异常转换成对用户友好的中文提示 */
export function toErrorMessage(
  err: unknown,
  fallback = "请求失败，请稍后重试"
): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    if (status === 429) return "请求过于频繁，已被接口限流，请稍后再试";
    if (err.code === "ECONNABORTED") return "请求超时，请检查网络后重试";
    if (!err.response) return "网络错误：接口无法访问或被浏览器插件拦截";
    return `接口请求失败（HTTP ${status}）`;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
