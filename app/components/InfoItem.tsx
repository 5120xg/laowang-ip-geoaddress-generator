"use client";

import { DataList, Text, Skeleton, Flex } from "@radix-ui/themes";
import { ReactNode } from "react";
import { CopyWrapper } from "./CopyWrapper";

interface InfoItemProps {
  label: string;
  value?: string;
  /** 没有值时显示的灰色提示；不传则整行隐藏 */
  placeholder?: string;
  loading?: boolean;
  extraIcon?: ReactNode;
  textSize?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
}

export const InfoItem = ({
  label,
  value,
  placeholder,
  loading,
  extraIcon,
  textSize = "2",
}: InfoItemProps) => {
  if (!loading && !value && !placeholder) return null;

  return (
    <DataList.Item>
      <DataList.Label minWidth="60px" style={{ marginLeft: "8px" }}>
        <Flex align="center" gap="2">
          <Text size={textSize}>{label}</Text>
          {extraIcon}
        </Flex>
      </DataList.Label>
      <DataList.Value>
        {loading ? (
          <Skeleton>
            <Text>Loading...</Text>
          </Skeleton>
        ) : value ? (
          <CopyWrapper value={value}>
            <Text highContrast style={{ wordBreak: "break-word", textAlign: "left" }}>
              {value}
            </Text>
          </CopyWrapper>
        ) : (
          <Text color="gray">{placeholder}</Text>
        )}
      </DataList.Value>
    </DataList.Item>
  );
};
