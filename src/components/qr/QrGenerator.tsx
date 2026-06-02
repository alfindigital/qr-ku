import { useEffect, useMemo, useRef, useState } from "react";
import QRCodeStyling, {
  type DotType,
  type Options as QrOptions,
} from "qr-code-styling";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Pencil,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { useQrHistory, type QrHistoryItem } from "@/hooks/use-qr-history";

type ContentType = "url" | "wa" | "text" | "email" | "phone" | "geo" | "wifi";

const COLOR_PRESETS = [
  "#111827",
  "#16a34a",
  "#2563eb",
  "#dc2626",
  "#ea580c",
];


const SHAPES: { id: DotType; label: string }[] = [
  { id: "square", label: "Kotak" },
  { id: "rounded", label: "Membulat" },
  { id: "dots", label: "Bulat" },
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
};

export function QrGenerator() {
  const [type, setType] = useState<ContentType>("url");
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const [color, setColor] = useState(COLOR_PRESETS[1]);
  const [bgTransparent, setBgTransparent] = useState(false);
  const [shape, setShape] = useState<DotType>("rounded");
  const [logo, setLogo] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

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
      qrOptions: { errorCorrectionLevel: "H" },
      dotsOptions: { color, type: shape },
      backgroundOptions: {
        color: bgTransparent ? "transparent" : "#ffffff",
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
    [data, color, shape, bgTransparent, logo, qrSize],
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
      ctx.fillStyle = "#ffffff";
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

  async function handleDownload() {
    if (!hasData) {
      toast.error("Isi dulu kontennya ya");
      return;
    }
    const canvas = await renderToCanvas(1024);
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const link = document.createElement("a");
      link.download = `qr-${Date.now()}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
      toast.success("QR berhasil diunduh");
      history.save({
        type,
        label: TAB_LABELS[type],
        data,
        color,
        shape: String(shape),
        caption,
        form: { ...form },
      });
    }, "image/png");
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

  function loadFromHistory(item: QrHistoryItem) {
    setType(item.type as ContentType);
    setForm({ ...INITIAL_FORM, ...(item.form as Partial<FormState>) } as FormState);
    setColor(item.color);
    setShape(item.shape as DotType);
    setCaption(item.caption);
    toast.success("Riwayat dimuat");
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
    setType(item.type as ContentType);
    setForm({ ...INITIAL_FORM, ...(item.form as Partial<FormState>) } as FormState);
    setColor(item.color);
    setShape(item.shape as DotType);
    setCaption(item.caption);
    toast.success("Riwayat dimuat");
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-3 py-5 sm:px-4 sm:py-6 lg:py-10">
      <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1fr_360px]">
        {/* LEFT: Input + Customize */}
        <div className="order-1 space-y-4 sm:space-y-5 lg:order-1">
          {/* Quick templates */}
          <section className="rounded-xl border border-border/60 bg-card p-4 sm:p-5 lg:p-6">
            <h2 className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              Template cepat
            </h2>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => applyTemplate(t)}
                  className="shrink-0 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border/60 bg-card p-4 sm:p-5 lg:p-6">
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              1. Pilih jenis isi
            </h2>
            <Tabs value={type} onValueChange={(v) => setType(v as ContentType)}>
              <TabsList className="grid h-auto w-full grid-cols-4 gap-1 bg-muted p-1 sm:grid-cols-7">
                <TabsTrigger value="url" className="flex h-11 flex-col gap-0.5 text-xs">
                  <LinkIcon className="h-4 w-4" />
                  Link
                </TabsTrigger>
                <TabsTrigger value="wa" className="flex h-11 flex-col gap-0.5 text-xs">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
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
                  className="h-12 text-base"
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
                <p className="text-xs text-muted-foreground">
                  Scan untuk langsung menelepon nomor ini.
                </p>
              </TabsContent>

              <TabsContent value="geo" className="mt-4 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="glink">Link Google Maps (opsional)</Label>
                  <Input
                    id="glink"
                    placeholder="https://maps.google.com/?q=..."
                    value={form.geoLink}
                    onChange={(e) => update("geoLink", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="lat">Latitude</Label>
                    <Input
                      id="lat"
                      inputMode="decimal"
                      placeholder="-6.2088"
                      value={form.geoLat}
                      onChange={(e) => update("geoLat", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lng">Longitude</Label>
                    <Input
                      id="lng"
                      inputMode="decimal"
                      placeholder="106.8456"
                      value={form.geoLng}
                      onChange={(e) => update("geoLng", e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Jika link diisi, lat/lng diabaikan.
                </p>
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
                  <p className="text-xs text-muted-foreground">
                    Contoh: MyCafe_WiFi
                  </p>
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
                  <p className="text-xs text-muted-foreground">
                    {form.wifiEnc === "nopass"
                      ? "Dinonaktifkan karena mode Tanpa Password dipilih."
                      : "Contoh: cafepass123"}
                  </p>
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
                <div className="rounded-lg border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
                  <p className="mb-1 font-medium text-foreground">Format yang dihasilkan:</p>
                  <code className="block break-all rounded bg-background px-2 py-1 text-[11px]">
                    WIFI:T:{form.wifiEnc || "WPA"};S:{form.wifiSsid.trim() || "NamaWiFi"};
                    {form.wifiEnc === "nopass" ? "" : `P:${form.wifiPass || "password"};`}
                    {form.wifiHidden ? "H:true;" : ""};
                  </code>
                  <p className="mt-1.5">
                    SSID = nama jaringan. T = tipe keamanan (WPA/WEP/nopass).
                    P = password (hilangkan jika nopass). H:true = hidden.
                  </p>
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
                <Label className="mb-2 block">Warna QR</Label>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full border-2 transition-transform ${
                        color === c
                          ? "scale-110 border-foreground"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                      aria-label={`Warna ${c}`}
                    />
                  ))}
                  <label className="relative h-8 w-8 sm:h-9 sm:w-9 cursor-pointer overflow-hidden rounded-full border-2 border-dashed border-border">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <span className="flex h-full w-full items-center justify-center text-[10px] sm:text-xs text-muted-foreground">
                      +
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

            <div className="mt-4 flex items-center gap-2">
              <Button
                onClick={handleDownload}
                disabled={!hasData}
                className="h-11 w-11 shrink-0 p-0"
                title="Download PNG"
              >
                <Download className="h-5 w-5" />
              </Button>
              <Button
                onClick={handleCopy}
                disabled={!hasData}
                variant="outline"
                className="h-11 w-11 shrink-0 p-0"
                title="Salin gambar"
              >
                <Copy className="h-5 w-5" />
              </Button>
              <Button
                onClick={handleShare}
                disabled={!hasData}
                variant="outline"
                className="h-11 w-11 shrink-0 p-0"
                title="Bagikan"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {!hasData && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Isi dulu kontennya di atas
              </p>
            )}
          </div>

          {history.items.length > 0 && (
            <div className="rounded-xl border border-border/60 bg-card p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  <History className="h-3.5 w-3.5" />
                  Riwayat QR
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Hapus semua riwayat?")) {
                      history.clear();
                    }
                  }}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Hapus semua
                </button>
              </div>
              <ul className="space-y-2 max-h-72 overflow-y-auto">
                {history.items.map((it) => (
                  <li
                    key={it.id}
                    className="flex items-center gap-2 rounded-lg border border-border/60 bg-background p-2"
                  >
                    <div
                      className="h-8 w-8 shrink-0 rounded"
                      style={{ backgroundColor: it.color }}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-foreground">
                        {it.label}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {it.data}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => loadFromHistory(it)}
                        className="flex items-center gap-1 rounded px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Hapus riwayat ini?")) {
                            history.remove(it.id);
                          }
                        }}
                        className="flex items-center gap-1 rounded px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-destructive"
                        title="Hapus"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Hapus</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          </div>
        </aside>
      </div>
    </div>
  );
}