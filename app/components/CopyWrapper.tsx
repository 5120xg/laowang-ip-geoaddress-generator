"use client";

import { IconButton, Flex } from "@radix-ui/themes";
import { CopyStatus } from "./CopyStatus";
import { ReactNode, useEffect, useRef, useState } from "react";

interface CopyWrapperProps {
  children: ReactNode;
  value: string;
}

/** 非 HTTPS 环境下 navigator.clipboard 不可用，回退到 execCommand */
async function copyText(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  textarea.remove();
  if (!ok) throw new Error("copy failed");
}

export const CopyWrapper = ({ children, value }: CopyWrapperProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const handleCopy = async () => {
    try {
      await copyText(value);
      setIsCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  return (
    <IconButton
      size="3"
      aria-label={`复制 ${value}`}
      color="gray"
      variant="ghost"
      className="group"
      style={{ height: "auto", width: "auto", maxWidth: "100%" }}
      onClick={handleCopy}
    >
      <Flex align="center" gap="2">
        {children}
        <CopyStatus isCopied={isCopied} />
      </Flex>
    </IconButton>
  );
};
