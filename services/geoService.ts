import { http, sleep } from "./http";
import type { Address, Coordinates, Region } from "@/app/types";

const NOMINATIM = "https://nominatim.openstreetmap.org";
/** Nominatim 使用政策：每秒最多 1 次请求 */
const NOMINATIM_INTERVAL = 1100;
const MAX_ATTEMPTS = 3;

interface NominatimAddress {
  house_number?: string;
  road?: string;
  pedestrian?: string;
  city?: string;
  town?: string;
  village?: string;
  hamlet?: string;
  municipality?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
}

/** 在中心点附近随机偏移（0.01° ≈ 1.1km） */
function randomOffset(center: Coordinates, radius: number): Coordinates {
  return {
    latitude: center.latitude + (Math.random() - 0.5) * 2 * radius,
    longitude: center.longitude + (Math.random() - 0.5) * 2 * radius,
  };
}

function normalizeAddress(raw: NominatimAddress, point: Coordinates): Address {
  const street = raw.road ?? raw.pedestrian;
  return {
    road: street ? [raw.house_number, street].filter(Boolean).join(" ") : undefined,
    city:
      raw.city ?? raw.town ?? raw.village ?? raw.hamlet ?? raw.municipality ?? raw.county,
    state: raw.state,
    postcode: raw.postcode,
    country: raw.country,
    countryCode: raw.country_code?.toUpperCase(),
    coordinates: point,
  };
}

/** 地区 → 坐标（结构化查询，参数由 axios 负责编码） */
export async function geocodeRegion(region: Region): Promise<Coordinates> {
  const { data } = await http.get<Array<{ lat: string; lon: string }>>(
    `${NOMINATIM}/search`,
    {
      params: {
        city: region.city,
        state: region.state,
        country: region.country,
        format: "json",
        limit: 1,
      },
    }
  );
  const hit = data?.[0];
  if (!hit) throw new Error(`找不到该地区：${region.city}, ${region.state}`);
  return { latitude: Number(hit.lat), longitude: Number(hit.lon) };
}

/**
 * 在中心点附近随机取点并反查真实地址。
 * 若取到的点没有街道/城市（海面、荒地等），会缩小范围重试。
 */
export async function randomAddressNear(center: Coordinates): Promise<Address> {
  let fallback: Address | null = null;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) await sleep(NOMINATIM_INTERVAL);
    const point = randomOffset(center, attempt === 0 ? 0.01 : 0.004);
    const { data } = await http.get<{ address?: NominatimAddress }>(
      `${NOMINATIM}/reverse`,
      {
        params: {
          lat: point.latitude.toFixed(6),
          lon: point.longitude.toFixed(6),
          format: "json",
          zoom: 18,
          addressdetails: 1,
          "accept-language": "en",
        },
      }
    );
    if (!data?.address) continue;

    const address = normalizeAddress(data.address, point);
    if (address.road && address.city) return address;
    fallback ??= address;
  }

  if (fallback) return fallback;
  throw new Error("该位置附近没有找到可用地址，请重试");
}

export function formatAddress(address: Address): string {
  return [address.road, address.city, address.state, address.postcode, address.country]
    .filter(Boolean)
    .join(", ");
}

function mapQuery(address: Address): string {
  return [address.road, address.city, address.state, address.country]
    .filter(Boolean)
    .join(", ");
}

export function getGoogleMapUrl(address: Address): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapQuery(address)
  )}`;
}

export function getGoogleMapEmbedUrl(address: Address): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(
    mapQuery(address)
  )}&output=embed&z=16`;
}
