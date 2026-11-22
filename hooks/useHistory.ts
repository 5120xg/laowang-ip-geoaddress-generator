import { useCallback, useEffect, useState } from "react";
import type { GeneratedIdentity, HistoryRecord } from "@/app/types";

const STORAGE_KEY = "addressHistory";
/** 未收藏记录最多保留条数（收藏的记录不受限制） */
const MAX_UNSTARRED = 20;

const newId = () =>
  `history-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

/** 收藏置顶，其余按时间倒序 */
function sortHistory(list: HistoryRecord[]): HistoryRecord[] {
  return [...list].sort(
    (a, b) =>
      Number(!!b.isStarred) - Number(!!a.isStarred) || b.timestamp - a.timestamp
  );
}

function normalize(list: HistoryRecord[]): HistoryRecord[] {
  const sorted = sortHistory(list);
  const starred = sorted.filter((r) => r.isStarred);
  const others = sorted.filter((r) => !r.isStarred).slice(0, MAX_UNSTARRED);
  return [...starred, ...others];
}

function isHistoryRecord(value: unknown): value is HistoryRecord {
  const r = value as HistoryRecord;
  return (
    !!r &&
    typeof r === "object" &&
    typeof r.timestamp === "number" &&
    !!r.user?.name &&
    !!r.address
  );
}

function readStorage(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    return normalize(
      parsed.filter(isHistoryRecord).map((record) => {
        let id = typeof record.id === "string" && record.id ? record.id : newId();
        if (seen.has(id)) id = newId();
        seen.add(id);
        return { ...record, id };
      })
    );
  } catch (e) {
    console.error("读取历史记录失败:", e);
    return [];
  }
}

export default function useHistory() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  // 只在客户端读取；加载完成前不写入，避免空数组覆盖已有记录
  useEffect(() => {
    setHistory(readStorage());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error("保存历史记录失败:", e);
    }
  }, [history, loaded]);

  const addRecord = useCallback((identity: GeneratedIdentity) => {
    const record: HistoryRecord = {
      ...identity,
      id: newId(),
      timestamp: Date.now(),
      isStarred: false,
    };
    setHistory((prev) => normalize([record, ...prev]));
    setSelectedId(record.id);
  }, []);

  const toggleStarred = useCallback((id: string) => {
    setHistory((prev) =>
      normalize(
        prev.map((r) => (r.id === id ? { ...r, isStarred: !r.isStarred } : r))
      )
    );
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setHistory((prev) => prev.filter((r) => r.id !== id));
    setSelectedId((current) => (current === id ? "" : current));
  }, []);

  const deleteAll = useCallback(() => {
    setHistory([]);
    setSelectedId("");
  }, []);

  return {
    history,
    selectedId,
    setSelectedId,
    addRecord,
    toggleStarred,
    deleteRecord,
    deleteAll,
  };
}
