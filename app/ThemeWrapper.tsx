"use client";

import { ThemeProvider } from "next-themes";
import { Theme } from "@radix-ui/themes";
import { ReactNode } from "react";

export default function ThemeWrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Theme accentColor="cyan">{children}</Theme>
    </ThemeProvider>
  );
}
