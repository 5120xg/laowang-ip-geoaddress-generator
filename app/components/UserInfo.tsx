"use client";

import { DataList } from "@radix-ui/themes";
import type { User } from "../types";
import { InfoItem } from "./InfoItem";

interface UserInfoProps {
  user: User | null;
  loading: boolean;
  email: string;
  emailLoading: boolean;
  emailError: string;
}

export function UserInfo({
  user,
  loading,
  email,
  emailLoading,
  emailError,
}: Readonly<UserInfoProps>) {
  return (
    <DataList.Root>
      <InfoItem label="名" value={user?.name.first} loading={loading} />
      <InfoItem label="姓" value={user?.name.last} loading={loading} />
      <InfoItem label="电话" value={user?.phone} loading={loading} />
      {/* 证件号：美国为 SSN，其他国家为各自证件类型；没有则不显示 */}
      <InfoItem
        label={user?.id?.name || "SSN"}
        value={user?.id?.value ?? undefined}
        loading={loading}
      />
      <InfoItem
        label="邮箱"
        value={email || undefined}
        placeholder={emailError ? "临时邮箱不可用" : undefined}
        loading={emailLoading}
      />
    </DataList.Root>
  );
}
