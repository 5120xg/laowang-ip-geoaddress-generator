import { http } from "./http";
import type { IPInfo } from "@/app/types";

const IPV4 =
  /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
const IPV6 = /^[0-9a-fA-F:.]+$/;

export function isValidIP(value: string): boolean {
  const ip = value.trim();
  return IPV4.test(ip) || (ip.includes(":") && IPV6.test(ip));
}

/** 获取当前访问者的公网 IP */
export async function fetchCurrentIP(): Promise<string> {
  const { data } = await http.get<{ ip?: string }>(
    "https://api.ipify.org?format=json"
  );
  if (!data?.ip) throw new Error("未能获取当前 IP");
  return data.ip;
}

interface IpapiResponse {
  ip?: string;
  latitude?: number | string;
  longitude?: number | string;
  country_code?: string;
  error?: boolean;
  reason?: string;
}

/** 查询 IP 的坐标和国家（ipapi.co 限流时也会返回 200 + error 字段，需要单独判断） */
export async function fetchIPInfo(ip: string): Promise<IPInfo> {
  const { data } = await http.get<IpapiResponse>(
    `https://ipapi.co/${encodeURIComponent(ip.trim())}/json/`
  );
  if (data?.error) {
    throw new Error(`IP 定位失败：${data.reason ?? "未知原因"}`);
  }
  const latitude = Number(data?.latitude);
  const longitude = Number(data?.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("IP 定位失败：未返回有效坐标（可能被限流，请稍后再试）");
  }
  return {
    ip: ip.trim(),
    coordinates: { latitude, longitude },
    countryCode: data.country_code?.toUpperCase(),
  };
}
