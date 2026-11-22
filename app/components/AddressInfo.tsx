"use client";

import { DataList, IconButton, HoverCard, Box, Inset } from "@radix-ui/themes";
import { GlobeIcon } from "@radix-ui/react-icons";
import type { Address } from "../types";
import {
  formatAddress,
  getGoogleMapEmbedUrl,
  getGoogleMapUrl,
} from "@/services/geoService";
import { InfoItem } from "./InfoItem";

interface AddressInfoProps {
  address: Address | null;
  loading: boolean;
}

const FIELDS: Array<{ id: keyof Address; label: string }> = [
  { id: "road", label: "街道" },
  { id: "city", label: "城市" },
  { id: "state", label: "州/省" },
  { id: "postcode", label: "邮编" },
  { id: "country", label: "国家" },
];

function MapIcon({ address }: { address: Address }) {
  const mapUrl = getGoogleMapUrl(address);
  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <IconButton size="1" variant="ghost" aria-label="在 Google 地图中查看" asChild>
          <a href={mapUrl} target="_blank" rel="noopener noreferrer">
            <GlobeIcon />
          </a>
        </IconButton>
      </HoverCard.Trigger>
      <HoverCard.Content
        style={{
          padding: "10px",
          overflow: "hidden",
          backgroundColor: "var(--gray-1)",
          border: "1px solid var(--gray-6)",
          borderRadius: "var(--radius-3)",
          width: "min(500px, calc(100vw - 32px))",
        }}
        align="start"
        side="top"
        sideOffset={5}
      >
        <Inset clip="padding-box" side="all" p="0">
          <Box style={{ width: "100%", height: "320px", overflow: "hidden" }}>
            <iframe
              title="地图预览"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={getGoogleMapEmbedUrl(address)}
            />
          </Box>
        </Inset>
      </HoverCard.Content>
    </HoverCard.Root>
  );
}

export function AddressInfo({ address, loading }: Readonly<AddressInfoProps>) {
  return (
    <DataList.Root>
      {FIELDS.map((field) => (
        <InfoItem
          key={field.id}
          label={field.label}
          value={address?.[field.id]?.toString()}
          loading={loading}
          extraIcon={
            field.id === "road" && address && !loading ? (
              <MapIcon address={address} />
            ) : undefined
          }
        />
      ))}
      <InfoItem
        label="完整地址"
        value={address ? formatAddress(address) : undefined}
        loading={loading}
      />
    </DataList.Root>
  );
}
