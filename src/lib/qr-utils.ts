// Shared utilities: contrast, share-state encode/decode, vCard builder.

export function hexToLuminance(hex: string): number {
  const c = hex.replace("#", "");
  const full = c.length === 3 ? c.split("").map((x) => x + x).join("") : c;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(a: string, b: string): number {
  const L1 = hexToLuminance(a);
  const L2 = hexToLuminance(b);
  const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}

export function buildVCard(f: {
  name: string;
  org?: string;
  title?: string;
  phone?: string;
  email?: string;
  url?: string;
  address?: string;
}): string {
  const esc = (v: string) => v.replace(/([\\;,])/g, "\\$1").replace(/\n/g, "\\n");
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `FN:${esc(f.name)}`];
  if (f.org) lines.push(`ORG:${esc(f.org)}`);
  if (f.title) lines.push(`TITLE:${esc(f.title)}`);
  if (f.phone) lines.push(`TEL;TYPE=CELL:${esc(f.phone)}`);
  if (f.email) lines.push(`EMAIL:${esc(f.email)}`);
  if (f.url) lines.push(`URL:${esc(f.url)}`);
  if (f.address) lines.push(`ADR:;;${esc(f.address)};;;;`);
  lines.push("END:VCARD");
  return lines.join("\n");
}

// URL-safe base64 (works with unicode)
export function encodeState(obj: unknown): string {
  const json = JSON.stringify(obj);
  const b64 =
    typeof btoa !== "undefined"
      ? btoa(unescape(encodeURIComponent(json)))
      : Buffer.from(json, "utf-8").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeState<T = unknown>(s: string): T | null {
  try {
    let b64 = s.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const json =
      typeof atob !== "undefined"
        ? decodeURIComponent(escape(atob(b64)))
        : Buffer.from(b64, "base64").toString("utf-8");
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export const PRINT_SIZES: { id: string; label: string; px: number }[] = [
  { id: "small", label: "Stiker 5cm", px: 600 },
  { id: "medium", label: "Standar", px: 1024 },
  { id: "a4", label: "Flyer A4", px: 2480 },
  { id: "a3", label: "Poster A3", px: 3508 },
];

export const EC_LEVELS: { id: "L" | "M" | "Q" | "H"; label: string; hint: string }[] = [
  { id: "L", label: "Rendah", hint: "QR paling ringan, cocok teks pendek tanpa logo" },
  { id: "M", label: "Sedang", hint: "Seimbang, default untuk kebanyakan kasus" },
  { id: "Q", label: "Tinggi", hint: "Tahan sedikit rusak / kena tinta" },
  { id: "H", label: "Maksimum", hint: "Wajib jika pakai logo di tengah" },
];