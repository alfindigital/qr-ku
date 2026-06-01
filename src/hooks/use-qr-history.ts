import { useEffect, useState, useCallback } from "react";

export type QrHistoryItem = {
  id: string;
  type: string;
  label: string;
  data: string;
  color: string;
  shape: string;
  caption: string;
  form: Record<string, string | boolean>;
  createdAt: number;
};

const KEY = "qrku:history:v1";
const MAX = 20;

function read(): QrHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: QrHistoryItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // ignore quota errors
  }
}

export function useQrHistory() {
  const [items, setItems] = useState<QrHistoryItem[]>([]);

  useEffect(() => {
    setItems(read());
  }, []);

  const save = useCallback((item: Omit<QrHistoryItem, "id" | "createdAt">) => {
    setItems((prev) => {
      const next: QrHistoryItem = {
        ...item,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: Date.now(),
      };
      // dedupe by same data+color+shape+caption
      const filtered = prev.filter(
        (p) =>
          !(
            p.data === next.data &&
            p.color === next.color &&
            p.shape === next.shape &&
            p.caption === next.caption
          ),
      );
      const updated = [next, ...filtered].slice(0, MAX);
      write(updated);
      return updated;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      write(updated);
      return updated;
    });
  }, []);

  const clear = useCallback(() => {
    write([]);
    setItems([]);
  }, []);

  return { items, save, remove, clear };
}