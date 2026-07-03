import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import QRCodeStyling, {
  type DotType,
  type Options as QrOptions,
} from "qr-code-styling";
import jsPDF from "jspdf";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Link as LinkIcon,
  MessageCircle,
  Type,
  Download,
  Copy,
  Share2,
  Upload,
  Trash2,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Wifi,
  History,
  Save,
  Plus,
  User as UserIcon,
  FileText,
  Image as ImageIcon,
  AlertTriangle,
  Link2,
} from "lucide-react";
import { toast } from "sonner";
import { useQrHistory } from "@/hooks/use-qr-history";
import {
  buildVCard,
  contrastRatio,
  decodeState,
  encodeState,
  PRINT_SIZES,
} from "@/lib/qr-utils";

type ContentType = "url" | "wa" | "text" | "email" | "phone" | "geo" | "wifi" | "vcard";
type EcLevel = "L" | "M" | "Q" | "H";

type Theme = {
  id: string;
  label: string;
  hex: string;
  primary: string;
  primaryGlow: string;
  primaryForeground: string;
};

const THEMES: Theme[] = [
  {
    id: "hijau",
    label: "Hijau",
    hex: "#16a34a",
    primary: "oklch(0.62 0.17 152)",
    primaryGlow: "oklch(0.72 0.18 152)",
    primaryForeground: "oklch(0.99 0.005 150)",
  },
  {
    id: "biru",
    label: "Biru",
    hex: "#2563eb",
    primary: "oklch(0.55 0.2 260)",
    primaryGlow: "oklch(0.68 0.18 260)",
    primaryForeground: "oklch(0.99 0.005 260)",
  },
  {
    id: "ungu",
    label: "Ungu",
    hex: "#9333ea",
    primary: "oklch(0.55 0.24 300)",
    primaryGlow: "oklch(0.68 0.2 300)",
    primaryForeground: "oklch(0.99 0.005 300)",
  },
  {
    id: "merah",
    label: "Merah",
    hex: "#dc2626",
    primary: "oklch(0.58 0.22 25)",
    primaryGlow: "oklch(0.7 0.2 25)",
    primaryForeground: "oklch(0.99 0.005 25)",
  },
  {
    id: "oranye",
    label: "Oranye",
    hex: "#ea580c",
    primary: "oklch(0.65 0.2 50)",
    primaryGlow: "oklch(0.76 0.18 50)",
    primaryForeground: "oklch(0.99 0.01 60)",
  },
  {
    id: "gelap",
    label: "Gelap",
    hex: "#111827",
    primary: "oklch(0.28 0.04 265)",
    primaryGlow: "oklch(0.42 0.05 265)",
    primaryForeground: "oklch(0.99 0.005 260)",
  },
];

const THEME_STORAGE_KEY = "qrku.theme";
const DRAFT_KEY = "qrku:draft";

type DraftState = {
  type: ContentType;
  form: FormState;
  themeId: string;
  color: string;
  bgTransparent: boolean;
  shape: DotType;
  logo: string | null;
  caption: string;
  bgColor?: string;
  ecLevel?: EcLevel;
  printSize?: string;
};


const SHAPES: { id: DotType; label: string }[] = [
  { id: "square", label: "Kotak" },
  { id: "rounded", label: "Tumpul" },
  { id: "dots", label: "Titik Bulat" },
];

type FormState = {
  url: string;
  waNumber: string;
  waMsg: string;
  text: string;
  email: string;
  emailSubject: string;
  emailBody: string;
  phone: string;
  geoLat: string;
  geoLng: string;
  geoLink: string;
  wifiSsid: string;
  wifiPass: string;
  wifiEnc: "WPA" | "WEP" | "nopass";
  wifiHidden: boolean;
  vcName: string;
  vcPhone: string;
  vcEmail: string;
  vcOrg: string;
  vcTitle: string;
  vcUrl: string;
  vcAddr: string;
};

const INITIAL_FORM: FormState = {
  url: "",
  waNumber: "",
  waMsg: "",
  text: "",
  email: "",
  emailSubject: "",
  emailBody: "",
  phone: "",
  geoLat: "",
  geoLng: "",
  geoLink: "",
  wifiSsid: "",
  wifiPass: "",
  wifiEnc: "WPA",
  wifiHidden: false,
  vcName: "",
  vcPhone: "",
  vcEmail: "",
  vcOrg: "",
  vcTitle: "",
  vcUrl: "",
  vcAddr: "",
};

function escapeWifi(v: string) {
  return v.replace(/([\\;,":])/g, "\\$1");
}

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  let n = digits;
  if (n.startsWith("0")) n = "62" + n.slice(1);
  else if (n.startsWith("8")) n = "62" + n;
  return n;
}

function buildData(type: ContentType, f: FormState) {
  if (type === "url") {
    const v = f.url.trim();
    if (!v) return "";
    if (/^https?:\/\//i.test(v)) return v;
    return `https://${v}`;
  }
  if (type === "wa") {
    const n = normalizePhone(f.waNumber);
    if (!n) return "";
    const base = `https://wa.me/${n}`;
    return f.waMsg.trim() ? `${base}?text=${encodeURIComponent(f.waMsg.trim())}` : base;
  }
  if (type === "email") {
    const e = f.email.trim();
    if (!e) return "";
    const params = new URLSearchParams();
    if (f.emailSubject.trim()) params.set("subject", f.emailSubject.trim());
    if (f.emailBody.trim()) params.set("body", f.emailBody.trim());
    const q = params.toString();
    return `mailto:${e}${q ? `?${q}` : ""}`;
  }
  if (type === "phone") {
    const n = normalizePhone(f.phone);
    return n ? `tel:+${n}` : "";
  }
  if (type === "geo") {
    if (f.geoLink.trim()) return f.geoLink.trim();
    const lat = parseFloat(f.geoLat);
    const lng = parseFloat(f.geoLng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return "";
    return `geo:${lat},${lng}`;
  }
  if (type === "wifi") {
    const ssid = f.wifiSsid.trim();
    if (!ssid) return "";
    const enc = f.wifiEnc;
    const passPart = enc === "nopass" ? "" : `P:${escapeWifi(f.wifiPass)};`;
    const hiddenPart = f.wifiHidden ? "H:true;" : "";
    return `WIFI:T:${enc};S:${escapeWifi(ssid)};${passPart}${hiddenPart};`;
  }
  if (type === "vcard") {
    const name = f.vcName.trim();
    if (!name) return "";
    return buildVCard({
      name,
      org: f.vcOrg.trim(),
      title: f.vcTitle.trim(),
      phone: f.vcPhone.trim(),
      email: f.vcEmail.trim(),
      url: f.vcUrl.trim(),
      address: f.vcAddr.trim(),
    });
  }
  return f.text.trim();
}

const TAB_LABELS: Record<ContentType, string> = {
  url: "Link",
  wa: "WhatsApp",
  text: "Tulisan",
  email: "Email",
  phone: "Telepon",
  geo: "Lokasi",
  wifi: "WiFi",
  vcard: "Kartu Nama",
};

export function QrGenerator() {
  // IMPORTANT: initial state must match SSR — defer localStorage reads to mount effect.
  const [hydrated, setHydrated] = useState(false);
  const [type, setType] = useState<ContentType>("url");
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const [themeId, setThemeId] = useState<string>(THEMES[0].id);
  const activeTheme = useMemo(
    () => THEMES.find((t) => t.id === themeId) ?? THEMES[0],
    [themeId],
  );
  const [color, setColor] = useState<string>(THEMES[0].hex);
  const [bgTransparent, setBgTransparent] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [shape, setShape] = useState<DotType>("rounded");
  const [logo, setLogo] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [ecLevel, setEcLevel] = useState<EcLevel>("M");
  const [printSize, setPrintSize] = useState<string>("medium");

  // Load persisted draft once on mount to avoid SSR/CSR hydration mismatch.
  useEffect(() => {
    try {
      // 1) URL share state (?s=...) takes priority over localStorage draft
      const params = new URLSearchParams(window.location.search);
      const shared = params.get("s");
      if (shared) {
        const st = decodeState<Partial<DraftState>>(shared);
        if (st) {
          if (st.type && TAB_LABELS[st.type as ContentType]) setType(st.type as ContentType);
          if (st.form) setForm((f) => ({ ...f, ...st.form }));
          if (st.color) setColor(st.color);
          if (typeof st.bgTransparent === "boolean") setBgTransparent(st.bgTransparent);
          if (st.bgColor) setBgColor(st.bgColor);
          if (st.shape && ["square", "rounded", "dots"].includes(st.shape)) {
            setShape(st.shape as DotType);
          }
          if (typeof st.caption === "string") setCaption(st.caption);
          if (st.ecLevel) setEcLevel(st.ecLevel);
          if (st.printSize) setPrintSize(st.printSize);
          setHydrated(true);
          toast.success("Editor QR dimuat dari link bagikan");
          return;
        }
      }
      // 2) Query param ?type= from landing pages
      const qType = params.get("type");
      if (qType && TAB_LABELS[qType as ContentType]) {
        setType(qType as ContentType);
      }
      // 3) localStorage draft
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<DraftState>;
        if (parsed.type && TAB_LABELS[parsed.type as ContentType]) setType(parsed.type as ContentType);
        if (parsed.form) setForm((f) => ({ ...f, ...parsed.form }));
        const validTheme = THEMES.find((t) => t.id === parsed.themeId);
        if (validTheme) setThemeId(validTheme.id);
        else {
          const legacy = localStorage.getItem(THEME_STORAGE_KEY);
          const legacyTheme = THEMES.find((t) => t.id === legacy);
          if (legacyTheme) setThemeId(legacyTheme.id);
        }
        if (parsed.color) setColor(parsed.color);
        else if (validTheme) setColor(validTheme.hex);
        if (typeof parsed.bgTransparent === "boolean") setBgTransparent(parsed.bgTransparent);
        if (parsed.bgColor) setBgColor(parsed.bgColor);
        if (parsed.ecLevel) setEcLevel(parsed.ecLevel);
        if (parsed.printSize) setPrintSize(parsed.printSize);
        if (parsed.shape && ["square", "rounded", "dots"].includes(parsed.shape)) {
          setShape(parsed.shape as DotType);
        }
        if (parsed.logo) setLogo(parsed.logo);
        if (typeof parsed.caption === "string") setCaption(parsed.caption);
      } else {
        const legacy = localStorage.getItem(THEME_STORAGE_KEY);
        const legacyTheme = THEMES.find((t) => t.id === legacy);
        if (legacyTheme) {
          setThemeId(legacyTheme.id);
          setColor(legacyTheme.hex);
        }
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", activeTheme.primary);
    root.style.setProperty("--primary-glow", activeTheme.primaryGlow);
    root.style.setProperty("--primary-foreground", activeTheme.primaryForeground);
    localStorage.setItem(THEME_STORAGE_KEY, activeTheme.id);
  }, [activeTheme]);

  // Auto-save draft to localStorage whenever content changes
  useEffect(() => {
    if (typeof window === "undefined" || !hydrated) return;
    const draft: DraftState = {
      type,
      form,
      themeId,
      color,
      bgTransparent,
      shape,
      logo,
      caption,
      bgColor,
      ecLevel,
      printSize,
    };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // ignore quota errors (e.g. oversized logo)
    }
  }, [hydrated, type, form, themeId, color, bgTransparent, shape, logo, caption, bgColor, ecLevel, printSize]);

  function applyTheme(id: string) {
    const next = THEMES.find((t) => t.id === id) ?? THEMES[0];
    setThemeId(next.id);
    setColor(next.hex);
  }

  const data = useMemo(() => buildData(type, form), [type, form]);

  const history = useQrHistory();

  const ref = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const [qrSize, setQrSize] = useState(280);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      // leave room for inner padding (p-4 = 32px total)
      const size = Math.max(220, Math.min(320, Math.floor(w - 32)));
      setQrSize(size);
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const options: Partial<QrOptions> = useMemo(
    () => ({
      width: qrSize,
      height: qrSize,
      type: "svg",
      data: data || " ",
      margin: 8,
      qrOptions: { errorCorrectionLevel: logo ? "H" : ecLevel },
      dotsOptions: { color, type: shape },
      backgroundOptions: {
        color: bgTransparent ? "transparent" : bgColor,
      },
      cornersSquareOptions: { color, type: shape === "dots" ? "extra-rounded" : "square" },
      cornersDotOptions: { color, type: shape === "dots" ? "dot" : "square" },
      image: logo ?? undefined,
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 4,
        imageSize: 0.35,
        hideBackgroundDots: true,
      },
    }),
    [data, color, shape, bgTransparent, bgColor, logo, qrSize, ecLevel],
  );

  useEffect(() => {
    if (!ref.current) return;
    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(options);
      qrRef.current.append(ref.current);
    } else {
      qrRef.current.update(options);
    }
  }, [options]);

  const hasData = data.length > 0;

  async function renderToCanvas(size = 1024): Promise<HTMLCanvasElement | null> {
    if (!qrRef.current) return null;
    const blob = await qrRef.current.getRawData("png");
    if (!blob) return null;
    const url = URL.createObjectURL(blob as Blob);
    const img = new Image();
    img.src = url;
    await new Promise((res) => (img.onload = res));

    const padding = caption ? 80 : 24;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size + padding;
    const ctx = canvas.getContext("2d")!;
    if (!bgTransparent) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0, size, size);
    if (caption) {
      ctx.fillStyle = color;
      ctx.font = "bold 42px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(caption.toUpperCase(), size / 2, size + padding / 2);
    }
    URL.revokeObjectURL(url);
    return canvas;
  }

  function currentPrintSize(): number {
    return PRINT_SIZES.find((p) => p.id === printSize)?.px ?? 1024;
  }

  function saveToHistory() {
    history.save({
      type,
      label: TAB_LABELS[type],
      data,
      color,
      shape: String(shape),
      caption,
      form: { ...form },
    });
  }

  async function handleDownloadPng() {
    if (!hasData) {
      toast.error("Isi dulu kontennya ya");
      return;
    }
    const canvas = await renderToCanvas(currentPrintSize());
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const link = document.createElement("a");
      link.download = `qr-${Date.now()}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
      toast.success("PNG berhasil diunduh");
      saveToHistory();
    }, "image/png");
  }

  async function handleDownloadSvg() {
    if (!hasData || !qrRef.current) {
      toast.error("Isi dulu kontennya ya");
      return;
    }
    try {
      const blob = (await qrRef.current.getRawData("svg")) as Blob | null;
      if (!blob) return;
      const link = document.createElement("a");
      link.download = `qr-${Date.now()}.svg`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
      toast.success("SVG berhasil diunduh (vektor, tidak pecah saat diperbesar)");
      saveToHistory();
    } catch {
      toast.error("Gagal membuat SVG");
    }
  }

  async function handleDownloadPdf() {
    if (!hasData) {
      toast.error("Isi dulu kontennya ya");
      return;
    }
    const canvas = await renderToCanvas(1600);
    if (!canvas) return;
    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const size = 120; // 12cm QR in center
      const x = (pageW - size) / 2;
      const y = 30;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", x, y, size, size * (canvas.height / canvas.width));
      pdf.save(`qr-${Date.now()}.pdf`);
      toast.success("PDF berhasil diunduh");
      saveToHistory();
    } catch {
      toast.error("Gagal membuat PDF");
    }
  }

  async function handleCopy() {
    if (!hasData) {
      toast.error("Isi dulu kontennya ya");
      return;
    }
    try {
      const canvas = await renderToCanvas(1024);
      if (!canvas) return;
      const blob: Blob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/png"),
      );
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      toast.success("Gambar disalin! Tinggal paste");
    } catch {
      toast.error("Browser tidak mendukung salin gambar");
    }
  }

  async function handleShare() {
    if (!hasData) {
      toast.error("Isi dulu kontennya ya");
      return;
    }
    try {
      const canvas = await renderToCanvas(1024);
      if (!canvas) return;
      const blob: Blob = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/png"),
      );
      const file = new File([blob], "qr-code.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "QR Code" });
      } else {
        toast.error("Bagikan tidak didukung di perangkat ini");
      }
    } catch {
      // user cancelled
    }
  }

  function onLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo maksimal 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleShareEditorUrl() {
    if (!hasData) {
      toast.error("Isi dulu kontennya ya");
      return;
    }
    const state = { type, form, color, bgTransparent, bgColor, shape, caption, ecLevel, printSize };
    const encoded = encodeState(state);
    const url = `${window.location.origin}${window.location.pathname}?s=${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link editor disalin — tempel di WA/email untuk berbagi");
    } catch {
      // Fallback for browsers without clipboard perms
      window.prompt("Salin link ini:", url);
    }
  }

  function handleSave() {
    if (!hasData) {
      toast.error("Isi dulu kontennya ya");
      return;
    }
    history.save({
      type,
      label: TAB_LABELS[type],
      data,
      color,
      shape: String(shape),
      caption,
      form: { ...form },
    });
    toast.success("Tersimpan di riwayat");
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-3 py-5 sm:px-4 sm:py-6 lg:py-10">
      {/* History link — rendered into header slot to align with theme toggle */}
      <HeaderSlot>
        <Link
          to="/history"
          title="Riwayat QR"
          aria-label="Riwayat QR"
          className="inline-flex h-9 items-center justify-center gap-1 rounded-full border border-input bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <History className="h-4 w-4" />
          {history.items.length > 0 && (
            <span className="rounded-full bg-primary px-1.5 text-[10px] font-semibold leading-5 text-primary-foreground">
              {history.items.length}
            </span>
          )}
        </Link>
      </HeaderSlot>

      <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1fr_360px]">
        {/* LEFT: Input + Customize */}
        <div className="order-1 space-y-4 sm:space-y-5 lg:order-1">
          <section className="rounded-xl border border-border/60 bg-card p-4 sm:p-5 lg:p-6">
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              1. Pilih jenis isi
            </h2>
            <Tabs value={type} onValueChange={(v) => setType(v as ContentType)}>
              <TabsList className="grid h-auto w-full grid-cols-4 gap-1 bg-muted p-1 sm:grid-cols-8">
                <TabsTrigger value="url" className="flex h-11 flex-col gap-0.5 text-xs">
                  <LinkIcon className="h-4 w-4" />
                  Link
                </TabsTrigger>
                <TabsTrigger value="wa" className="flex h-11 flex-col gap-0.5 text-xs">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </TabsTrigger>
                <TabsTrigger value="vcard" className="flex h-11 flex-col gap-0.5 text-xs">
                  <UserIcon className="h-4 w-4" />
                  Kartu Nama
                </TabsTrigger>
                <TabsTrigger value="text" className="flex h-11 flex-col gap-0.5 text-xs">
                  <Type className="h-4 w-4" />
                  Tulisan
                </TabsTrigger>
                <TabsTrigger value="email" className="flex h-11 flex-col gap-0.5 text-xs">
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="phone" className="flex h-11 flex-col gap-0.5 text-xs">
                  <Phone className="h-4 w-4" />
                  Telepon
                </TabsTrigger>
                <TabsTrigger value="geo" className="flex h-11 flex-col gap-0.5 text-xs">
                  <MapPin className="h-4 w-4" />
                  Lokasi
                </TabsTrigger>
                <TabsTrigger value="wifi" className="flex h-11 flex-col gap-0.5 text-xs">
                  <Wifi className="h-4 w-4" />
                  WiFi
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="mt-4 space-y-2">
                <Label htmlFor="url">Alamat Website</Label>
                <Input
                  id="url"
                  inputMode="url"
                  placeholder="contoh: tokosaya.com"
                  value={form.url}
                  onChange={(e) => update("url", e.target.value)}
                  className="h-11 text-base"
                />
              </TabsContent>

              <TabsContent value="wa" className="mt-4 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="wa">Nomor WhatsApp</Label>
                  <Input
                    id="wa"
                    inputMode="tel"
                    placeholder="08123456789"
                    value={form.waNumber}
                    onChange={(e) => update("waNumber", e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wamsg">Pesan otomatis (opsional)</Label>
                  <Textarea
                    id="wamsg"
                    placeholder="Halo, saya mau pesan..."
                    value={form.waMsg}
                    onChange={(e) => update("waMsg", e.target.value)}
                    rows={2}
                  />
                </div>
              </TabsContent>

              <TabsContent value="text" className="mt-4 space-y-2">
                <Label htmlFor="text">Tulisan / Info</Label>
                <Textarea
                  id="text"
                  placeholder="Contoh: Warung Bu Siti, Jl. Mawar No.5"
                  value={form.text}
                  onChange={(e) => update("text", e.target.value)}
                  rows={3}
                />
              </TabsContent>

              <TabsContent value="email" className="mt-4 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="email">Alamat Email</Label>
                  <Input
                    id="email"
                    type="email"
                    inputMode="email"
                    placeholder="nama@email.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="esub">Subjek (opsional)</Label>
                  <Input
                    id="esub"
                    placeholder="Pertanyaan produk"
                    value={form.emailSubject}
                    onChange={(e) => update("emailSubject", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ebody">Isi pesan (opsional)</Label>
                  <Textarea
                    id="ebody"
                    placeholder="Halo, saya ingin bertanya..."
                    value={form.emailBody}
                    onChange={(e) => update("emailBody", e.target.value)}
                    rows={2}
                  />
                </div>
              </TabsContent>

              <TabsContent value="phone" className="mt-4 space-y-2">
                <Label htmlFor="tel">Nomor Telepon</Label>
                <Input
                  id="tel"
                  inputMode="tel"
                  placeholder="08123456789"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="h-12 text-base"
                />
              </TabsContent>

              <TabsContent value="geo" className="mt-4 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="glink">Link Google Maps</Label>
                  <Input
                    id="glink"
                    placeholder="https://maps.google.com/?q=..."
                    value={form.geoLink}
                    onChange={(e) => update("geoLink", e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="wifi" className="mt-4 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="ssid">Nama WiFi (SSID)</Label>
                  <Input
                    id="ssid"
                    placeholder="Contoh: MyCafe_WiFi"
                    value={form.wifiSsid}
                    onChange={(e) => update("wifiSsid", e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wpass">Password</Label>
                  <Input
                    id="wpass"
                    placeholder="Kosongkan jika tidak ada"
                    value={form.wifiPass}
                    onChange={(e) => update("wifiPass", e.target.value)}
                    disabled={form.wifiEnc === "nopass"}
                  />
                  {form.wifiEnc === "nopass" && (
                    <p className="text-xs text-muted-foreground">
                      Dinonaktifkan karena mode Tanpa Password dipilih.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Tipe Keamanan</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["WPA", "WEP", "nopass"] as const).map((enc) => (
                      <button
                        key={enc}
                        type="button"
                        onClick={() => update("wifiEnc", enc)}
                        className={`h-10 rounded-lg border-2 text-xs font-medium transition-colors ${
                          form.wifiEnc === enc
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-background text-muted-foreground"
                        }`}
                      >
                        {enc === "nopass" ? "Tanpa Password" : enc}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={form.wifiHidden}
                    onChange={(e) => update("wifiHidden", e.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                  Jaringan tersembunyi (hidden SSID)
                </label>
                <div className="rounded-lg border border-border/60 bg-muted/40 p-3">
                  <code className="block break-all text-xs text-muted-foreground">
                    WIFI:T:{form.wifiEnc || "WPA"};S:{form.wifiSsid.trim() || "NamaWiFi"};
                    {form.wifiEnc === "nopass" ? "" : `P:${form.wifiPass || "password"};`}
                    {form.wifiHidden ? "H:true;" : ""}
                  </code>
                </div>

              </TabsContent>

              <TabsContent value="vcard" className="mt-4 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="vcname">Nama Lengkap *</Label>
                  <Input
                    id="vcname"
                    placeholder="Contoh: Budi Santoso"
                    value={form.vcName}
                    onChange={(e) => update("vcName", e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="vcphone">Nomor HP</Label>
                    <Input
                      id="vcphone"
                      inputMode="tel"
                      placeholder="+6281234567890"
                      value={form.vcPhone}
                      onChange={(e) => update("vcPhone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vcemail">Email</Label>
                    <Input
                      id="vcemail"
                      type="email"
                      inputMode="email"
                      placeholder="budi@perusahaan.com"
                      value={form.vcEmail}
                      onChange={(e) => update("vcEmail", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="vcorg">Perusahaan / Organisasi</Label>
                    <Input
                      id="vcorg"
                      placeholder="PT Maju Bersama"
                      value={form.vcOrg}
                      onChange={(e) => update("vcOrg", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vctitle">Jabatan</Label>
                    <Input
                      id="vctitle"
                      placeholder="Manajer Pemasaran"
                      value={form.vcTitle}
                      onChange={(e) => update("vcTitle", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vcurl">Website</Label>
                  <Input
                    id="vcurl"
                    inputMode="url"
                    placeholder="https://perusahaan.com"
                    value={form.vcUrl}
                    onChange={(e) => update("vcUrl", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vcaddr">Alamat</Label>
                  <Textarea
                    id="vcaddr"
                    placeholder="Jl. Merdeka No. 10, Jakarta"
                    value={form.vcAddr}
                    onChange={(e) => update("vcAddr", e.target.value)}
                    rows={2}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </section>

          <section className="rounded-xl border border-border/60 bg-card p-4 sm:p-5 lg:p-6">
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              2. Atur tampilan
            </h2>

            <div className="space-y-5">
              <div>
                <Label className="mb-2 block">Tema warna</Label>
                <div className="flex flex-wrap items-center gap-2">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => applyTheme(t.id)}
                      className={`h-9 flex-1 min-w-[44px] rounded-full border-2 transition-transform ${
                        themeId === t.id
                          ? "scale-105 border-foreground"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: t.hex }}
                      title={t.label}
                      aria-label={t.label}
                    />
                  ))}
                  <label
                    className="relative h-9 flex-1 min-w-[44px] cursor-pointer overflow-hidden rounded-full border-2 border-dashed border-border"
                    title="Warna kustom"
                  >
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <span className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <Plus className="h-4 w-4" />
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Bentuk titik</Label>
                <div className="grid grid-cols-3 gap-2">
                  {SHAPES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setShape(s.id)}
                      className={`h-12 rounded-lg border-2 text-sm font-medium transition-colors ${
                        shape === s.id
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-background text-muted-foreground"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <Collapsible>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg py-2 text-sm font-medium text-foreground">
                  Lainnya (logo, teks, background)
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-3">
                  <div>
                    <Label className="mb-2 block">Logo di tengah</Label>
                    {logo ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={logo}
                          alt="Pratinjau logo QR"
                          className="h-12 w-12 rounded border border-border object-contain"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setLogo(null)}
                        >
                          <Trash2 className="mr-1 h-4 w-4" /> Hapus
                        </Button>
                      </div>
                    ) : (
                      <label className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary">
                        <Upload className="h-4 w-4" />
                        Upload gambar logo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={onLogoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caption">Teks di bawah QR (opsional)</Label>
                    <Input
                      id="caption"
                      placeholder="Contoh: SCAN MENU"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      maxLength={24}
                      className="h-11"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={bgTransparent}
                      onChange={(e) => setBgTransparent(e.target.checked)}
                      className="h-4 w-4 accent-primary"
                    />
                    Background transparan
                  </label>

                  {!bgTransparent && (
                    <div className="space-y-2">
                      <Label className="text-sm">Warna background</Label>
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          { c: "#ffffff", label: "Putih" },
                          { c: "#000000", label: "Hitam" },
                          { c: "#f5f5f4", label: "Krem" },
                          { c: "#0f172a", label: "Navy" },
                        ].map((b) => (
                          <button
                            key={b.c}
                            type="button"
                            onClick={() => setBgColor(b.c)}
                            title={b.label}
                            aria-label={b.label}
                            className={`h-9 w-9 rounded-full border-2 transition-transform ${
                              bgColor === b.c ? "scale-110 border-foreground" : "border-border"
                            }`}
                            style={{ backgroundColor: b.c }}
                          />
                        ))}
                        <label
                          className="relative h-9 w-9 cursor-pointer overflow-hidden rounded-full border-2 border-dashed border-border"
                          title="Warna kustom"
                        >
                          <input
                            type="color"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          />
                          <span className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <Plus className="h-4 w-4" />
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-sm">Ukuran cetak (PNG)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {PRINT_SIZES.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPrintSize(p.id)}
                          className={`h-auto min-h-[52px] rounded-lg border-2 px-2 py-2 text-left text-xs transition-colors ${
                            printSize === p.id
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border bg-background text-muted-foreground"
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </CollapsibleContent>
              </Collapsible>
            </div>
          </section>
        </div>

        {/* RIGHT: Preview + actions */}
        <aside className="order-2 lg:order-2 lg:sticky lg:top-20 lg:self-start">
          <div className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-card p-4 shadow-[var(--shadow-soft)] sm:p-5 lg:p-6">
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              3. Hasil QR
            </h2>
            <div ref={wrapRef} className="flex flex-col items-center justify-center rounded-xl bg-muted p-4">
              <div
                ref={ref}
                className={`flex items-center justify-center [&_svg]:h-auto [&_svg]:max-w-full ${
                  hasData ? "" : "opacity-30"
                }`}
              />
              {caption && (
                <p className="mt-2 text-center text-sm font-bold tracking-wider text-foreground">
                  {caption.toUpperCase()}
                </p>
              )}
            </div>

            {!hasData && (
              <p className="mt-3 rounded-lg bg-muted/60 px-3 py-2 text-center text-xs text-muted-foreground">
                Isi kontennya dulu di sebelah kiri, QR muncul otomatis di sini.
              </p>
            )}

            {hasData && !bgTransparent && contrastRatio(color, bgColor) < 3 && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Kontras warna QR & background rendah — mungkin susah di-scan.
                  Coba warna lebih gelap atau background lebih terang.
                </span>
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    disabled={!hasData}
                    className="flex h-auto min-h-[64px] flex-col items-center justify-center gap-1 px-2 py-2.5 text-xs font-medium leading-none"
                    title="Download QR (PNG / SVG / PDF)"
                  >
                    <Download className="h-5 w-5 shrink-0" />
                    Unduh
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem onClick={handleDownloadPng}>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="text-sm">PNG (gambar biasa)</span>
                      <span className="text-[10px] text-muted-foreground">Cocok untuk WA, IG, dokumen</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownloadSvg}>
                    <FileText className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="text-sm">SVG (vektor)</span>
                      <span className="text-[10px] text-muted-foreground">Tidak pecah saat diperbesar</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownloadPdf}>
                    <FileText className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="text-sm">PDF A4</span>
                      <span className="text-[10px] text-muted-foreground">Siap print tanpa edit</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={handleCopy}
                disabled={!hasData}
                variant="outline"
                className="flex h-auto min-h-[64px] flex-col items-center justify-center gap-1 px-2 py-2.5 text-xs font-medium leading-none"
                title="Salin gambar"
              >
                <Copy className="h-5 w-5 shrink-0" />
                Salin
              </Button>
              <Button
                onClick={handleShare}
                disabled={!hasData}
                variant="outline"
                className="flex h-auto min-h-[64px] flex-col items-center justify-center gap-1 px-2 py-2.5 text-xs font-medium leading-none"
                title="Bagikan"
              >
                <Share2 className="h-5 w-5 shrink-0" />
                Bagikan
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasData}
                variant="outline"
                className="flex h-auto min-h-[64px] flex-col items-center justify-center gap-1 px-2 py-2.5 text-xs font-medium leading-none"
                title="Simpan ke riwayat"
              >
                <Save className="h-5 w-5 shrink-0" />
                Simpan
              </Button>
            </div>

            <button
              type="button"
              onClick={handleShareEditorUrl}
              disabled={!hasData}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md py-2 text-xs text-muted-foreground transition-colors hover:text-primary disabled:opacity-40"
              title="Salin link editor untuk dibagikan ke tim"
            >
              <Link2 className="h-3.5 w-3.5" />
              Salin link editor (untuk revisi bareng tim)
            </button>
          </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function HeaderSlot({ children }: { children: React.ReactNode }) {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setTarget(document.getElementById("header-actions-slot"));
  }, []);
  if (!target) return null;
  return createPortal(children, target);
}