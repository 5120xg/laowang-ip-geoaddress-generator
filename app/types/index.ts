export interface User {
  name: {
    first: string;
    last: string;
  };
  phone: string;
  id: {
    name: string;
    value: string | null;
  };
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  road?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  countryCode?: string;
  coordinates?: Coordinates;
}

/** 地址模式下用户选择的地区 */
export interface Region {
  country: string;
  state: string;
  city: string;
  countryCode?: string;
}

export interface IPInfo {
  ip: string;
  coordinates: Coordinates;
  countryCode?: string;
}

export type InputMode = "ip" | "region";

export interface GeneratedIdentity {
  user: User;
  address: Address;
  source: InputMode;
  /** 仅 IP 模式下有值：用于生成地址的 IP */
  ip?: string;
}

export interface HistoryRecord {
  id: string;
  user: User;
  address: Address;
  source?: InputMode;
  ip?: string;
  timestamp: number;
  isStarred?: boolean;
}

export interface MailEvent {
  id: string;
  accountId: string;
  msgid: string;
  from: {
    address: string;
    name: string;
  };
  subject: string;
  intro: string;
  seen: boolean;
  isDeleted: boolean;
  hasAttachments: boolean;
  size: number;
  downloadUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface TempMailMessage {
  id: string;
  subject: string;
  intro: string;
  seen: boolean;
  from: {
    address: string;
    name: string;
  };
  createdAt: string;
  html: string[];
  text: string;
  cc: string[];
  bcc: string[];
  flagged: boolean;
  isDeleted: boolean;
  verifications: string[];
  retention: boolean;
  retentionDate: string;
  updatedAt: string;
}
