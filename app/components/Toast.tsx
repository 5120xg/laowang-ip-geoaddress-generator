"use client";

import { useEffect, useRef } from "react";
import { Card, Flex, Text, IconButton } from "@radix-ui/themes";
import { EnvelopeClosedIcon, Cross2Icon } from "@radix-ui/react-icons";
import type { TempMailMessage } from "../types";

interface ToastProps {
  message: TempMailMessage;
  onClose: () => void;
  onClick: (message: TempMailMessage) => void;
  duration?: number;
}

export function Toast({ message, onClose, onClick, duration = 5000 }: ToastProps) {
  // 用 ref 保存回调，避免父组件重渲染导致计时器被反复重置
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => onCloseRef.current(), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <Card
      role="status"
      onClick={() => onClick(message)}
      className="toast-slide-in hover:brightness-95 transition-all"
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        width: "min(360px, calc(100vw - 2rem))",
        cursor: "pointer",
        zIndex: 1000,
      }}
    >
      <Flex gap="3" align="center" p="2">
        <EnvelopeClosedIcon width="16" height="16" />
        <Flex direction="column" gap="1" style={{ flex: 1, minWidth: 0 }}>
          <Text weight="medium" truncate>
            {message.subject || "新邮件"}
          </Text>
          <Text size="1" color="gray" truncate>
            来自: {message.from.name} ({message.from.address})
          </Text>
        </Flex>
        <IconButton
          size="1"
          variant="ghost"
          aria-label="关闭"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <Cross2Icon />
        </IconButton>
      </Flex>
    </Card>
  );
}
