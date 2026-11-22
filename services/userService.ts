import { http } from "./http";
import type { User } from "@/app/types";

/** randomuser.me 支持的国籍 */
const SUPPORTED_NAT = new Set([
  "AU", "BR", "CA", "CH", "DE", "DK", "ES", "FI", "FR", "GB", "IE",
  "IN", "IR", "MX", "NL", "NO", "NZ", "RS", "TR", "UA", "US",
]);

/** 国家代码 → randomuser 国籍；不支持的国家回退到 US */
export function toNationality(countryCode?: string): string {
  const code = countryCode?.toUpperCase();
  if (code === "UK") return "GB";
  return code && SUPPORTED_NAT.has(code) ? code : "US";
}

export async function fetchRandomUser(countryCode?: string): Promise<User> {
  const { data } = await http.get<{ results?: User[] }>(
    "https://randomuser.me/api/",
    { params: { nat: toNationality(countryCode), inc: "name,phone,id" } }
  );
  const user = data?.results?.[0];
  if (!user) throw new Error("获取随机用户信息失败");
  return user;
}
