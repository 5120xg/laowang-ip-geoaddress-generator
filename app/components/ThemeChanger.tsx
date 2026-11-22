"use client";

import { useEffect, useState } from "react";
import { IconButton } from "@radix-ui/themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

interface ThemeChangerProps {
  iconSize: number;
}

export function ThemeChanger({ iconSize }: ThemeChangerProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 挂载前主题未知，固定渲染月亮图标，避免水合不一致
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <IconButton
      size="4"
      variant="ghost"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="切换主题"
    >
      {isDark ? (
        <SunIcon width={iconSize} height={iconSize} />
      ) : (
        <MoonIcon width={iconSize} height={iconSize} />
      )}
    </IconButton>
  );
}
