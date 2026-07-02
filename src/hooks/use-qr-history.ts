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
    const arr = Array.isArray(parsed) ? parsed : [];
    return arr.sort((a: QrHistoryItem, b: QrHistoryItem) => b.createdAt - a.createdAt);
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
      // Never persist logo blobs in history — they are base64 and blow past
      // localStorage quota fast. Reload from history restores form data only.
      const strippedForm: Record<string, string | boolean> = {};
      for (const [k, v] of Object.entries(item.form)) {
        if (typeof v === "string" && v.startsWith("data:")) continue;
        strippedForm[k] = v;
      }
      const next: QrHistoryItem = {
        ...item,
        form: strippedForm,
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