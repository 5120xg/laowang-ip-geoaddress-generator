import { sleep } from "./http";
import { fetchIPInfo } from "./ipService";
import { geocodeRegion, randomAddressNear } from "./geoService";
import { fetchRandomUser } from "./userService";
import type { GeneratedIdentity, Region } from "@/app/types";

export type GenerateRequest =
  | { mode: "ip"; ip: string }
  | { mode: "region"; region: Region };

/** 生成一份完整身份：地址与用户信息并行获取 */
export async function generateIdentity(
  request: GenerateRequest
): Promise<GeneratedIdentity> {
  if (request.mode === "ip") {
    const info = await fetchIPInfo(request.ip);
    const [address, user] = await Promise.all([
      randomAddressNear(info.coordinates),
      fetchRandomUser(info.countryCode),
    ]);
    return { user, address, source: "ip", ip: info.ip };
  }

  const center = await geocodeRegion(request.region);
  const [address, user] = await Promise.all([
    // 与上一次 Nominatim 请求间隔 1 秒，遵守其使用政策
    sleep(1000).then(() => randomAddressNear(center)),
    fetchRandomUser(request.region.countryCode),
  ]);
  return { user, address, source: "region" };
}
