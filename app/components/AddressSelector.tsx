"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Flex, Select, Button, Text } from "@radix-ui/themes";
import * as Popover from "@radix-ui/react-popover";
import styles from "./AddressSelector.module.css";
import type { Region } from "../types";

type RegionData = Record<string, Record<string, string[]>>;

const COUNTRY_CODES: Record<string, string> = {
  "United States": "US",
};

// 地区数据较大（~130KB），首次打开选择器时才加载，并在模块级缓存
let regionDataPromise: Promise<RegionData> | null = null;
function loadRegionData(): Promise<RegionData> {
  regionDataPromise ??= fetch("/data/regionData.json")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<RegionData>;
    })
    .catch((err) => {
      regionDataPromise = null; // 失败后允许重试
      throw err;
    });
  return regionDataPromise;
}

const byName = (a: string, b: string) => a.localeCompare(b);

interface AddressSelectorProps {
  children: React.ReactNode;
  value: Region | null;
  onSelect: (region: Region) => void;
}

export function AddressSelector({
  children,
  value,
  onSelect,
}: Readonly<AddressSelectorProps>) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<RegionData | null>(null);
  const [loadError, setLoadError] = useState("");
  const [country, setCountry] = useState(value?.country ?? "United States");
  const [state, setState] = useState(value?.state ?? "");
  const [city, setCity] = useState(value?.city ?? "");

  useEffect(() => {
    if (!open || data) return;
    let active = true;
    setLoadError("");
    loadRegionData()
      .then((d) => {
        if (active) setData(d);
      })
      .catch((err) => {
        console.error("加载地区数据失败:", err);
        if (active) setLoadError("地区数据加载失败，请关闭后重试");
      });
    return () => {
      active = false;
    };
  }, [open, data]);

  const countries = useMemo(
    () => (data ? Object.keys(data).sort(byName) : [country]),
    [data, country]
  );
  const states = useMemo(
    () => (data?.[country] ? Object.keys(data[country]).sort(byName) : []),
    [data, country]
  );
  const cities = useMemo(
    () => [...new Set(data?.[country]?.[state] ?? [])].sort(byName),
    [data, country, state]
  );

  const isLoading = open && !data && !loadError;

  const handleConfirm = () => {
    if (!country || !state || !city) return;
    onSelect({ country, state, city, countryCode: COUNTRY_CODES[country] });
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Box style={{ flex: 1 }}>{children}</Box>
      </Popover.Trigger>
      <Popover.Content align="start" sideOffset={4} className={styles.popoverContent}>
        <Box p="3">
          <Flex direction="column" gap="3">
            {loadError && (
              <Text size="2" color="red">
                {loadError}
              </Text>
            )}

            <Select.Root
              value={country}
              onValueChange={(v) => {
                setCountry(v);
                setState("");
                setCity("");
              }}
            >
              <Select.Trigger />
              <Select.Content>
                {countries.map((name) => (
                  <Select.Item key={name} value={name}>
                    {name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            <Select.Root
              value={state}
              onValueChange={(v) => {
                setState(v);
                setCity("");
              }}
              disabled={!data}
            >
              <Select.Trigger placeholder={isLoading ? "加载中..." : "选择州"} />
              <Select.Content>
                {states.map((name) => (
                  <Select.Item key={name} value={name}>
                    {name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            <Select.Root value={city} onValueChange={setCity} disabled={!state}>
              <Select.Trigger placeholder={isLoading ? "加载中..." : "选择城市"} />
              <Select.Content>
                {cities.map((name) => (
                  <Select.Item key={name} value={name}>
                    {name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            <Button onClick={handleConfirm} disabled={!country || !state || !city}>
              {isLoading ? "加载中..." : "确认"}
            </Button>
          </Flex>
        </Box>
      </Popover.Content>
    </Popover.Root>
  );
}
