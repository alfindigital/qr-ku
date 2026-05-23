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
  Link as LinkIcon,
  MessageCircle,
  Type,
  Download,
  Copy,
  Share2,
  Upload,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

type ContentType = "url" | "wa" | "text";

const COLOR_PRESETS = [
  "#111827",
  "#16a34a",
  "#2563eb",
  "#dc2626",
  "#7c3aed",
  "#ea580c",
];

const SHAPES: { id: DotType; label: string }[] = [
  { id: "square", label: "Kotak" },
  { id: "rounded", label: "Membulat" },
  { id: "dots", label: "Bulat" },
];

function buildData(type: ContentType, url: string, waNumber: string, waMsg: string, text: string) {
  if (type === "url") {
    const v = url.trim();
    if (!v) return "";
    if (/^https?:\/\//i.test(v)) return v;
    return `https://${v}`;
  }
  if (type === "wa") {
    const digits = waNumber.replace(/\D/g, "");
    if (!digits) return "";
    let normalized = digits;
    if (normalized.startsWith("0")) normalized = "62" + normalized.slice(1);
    if (normalized.startsWith("8")) normalized = "62" + normalized;
    const base = `https://wa.me/${normalized}`;
    return waMsg.trim() ? `${base}?text=${encodeURIComponent(waMsg.trim())}` : base;
  }
  return text.trim();
}

export function QrGenerator() {
  const [type, setType] = useState<ContentType>("url");
  const [url, setUrl] = useState("");
  const [waNumber, setWaNumber] = useState("");
  const [waMsg, setWaMsg] = useState("");
  const [text, setText] = useState("");

  const [color, setColor] = useState(COLOR_PRESETS[1]);
  const [bgTransparent, setBgTransparent] = useState(false);
  const [shape, setShape] = useState<DotType>("rounded");
  const [logo, setLogo] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  const data = useMemo(
    () => buildData(type, url, waNumber, waMsg, text),
    [type, url, waNumber, waMsg, text],
  );

  const ref = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  const options: Partial<QrOptions> = useMemo(
    () => ({
      width: 320,
      height: 320,
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
    [data, color, shape, bgTransparent, logo],
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

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* LEFT: Input + Customize */}
        <div className="space-y-5">
          <section className="rounded-xl border border-border/60 bg-card p-5 lg:p-6">
            <h2 className="mb-3 text-sm font-bold text-foreground">
              1. Pilih jenis isi
            </h2>
            <Tabs value={type} onValueChange={(v) => setType(v as ContentType)}>
              <TabsList className="grid h-auto w-full grid-cols-3 gap-1 bg-muted p-1">
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
              </TabsList>

              <TabsContent value="url" className="mt-4 space-y-2">
                <Label htmlFor="url">Alamat Website</Label>
                <Input
                  id="url"
                  inputMode="url"
                  placeholder="contoh: tokosaya.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
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
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wamsg">Pesan otomatis (opsional)</Label>
                  <Textarea
                    id="wamsg"
                    placeholder="Halo, saya mau pesan..."
                    value={waMsg}
                    onChange={(e) => setWaMsg(e.target.value)}
                    rows={2}
                  />
                </div>
              </TabsContent>

              <TabsContent value="text" className="mt-4 space-y-2">
                <Label htmlFor="text">Tulisan / Info</Label>
                <Textarea
                  id="text"
                  placeholder="Contoh: Warung Bu Siti, Jl. Mawar No.5"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={3}
                />
              </TabsContent>
            </Tabs>
          </section>

          <section className="rounded-xl border border-border/60 bg-card p-5 lg:p-6">
            <h2 className="mb-3 text-sm font-bold text-foreground">
              2. Atur tampilan
            </h2>

            <div className="space-y-5">
              <div>
                <Label className="mb-2 block">Warna QR</Label>
                <div className="flex flex-wrap items-center gap-2">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`h-10 w-10 rounded-full border-2 transition-transform ${
                        color === c
                          ? "scale-110 border-foreground"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                      aria-label={`Warna ${c}`}
                    />
                  ))}
                  <label className="relative h-10 w-10 cursor-pointer overflow-hidden rounded-full border-2 border-dashed border-border">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <span className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
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
                          alt="logo"
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
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)] lg:p-6">
            <h2 className="mb-3 text-sm font-bold text-foreground">
              3. Hasil QR
            </h2>
            <div className="flex items-center justify-center rounded-xl bg-[oklch(0.98_0.005_150)] p-4">
              <div
                ref={ref}
                className={`flex items-center justify-center ${
                  hasData ? "" : "opacity-30"
                }`}
              />
            </div>
            {caption && (
              <p
                className="mt-2 text-center text-sm font-bold tracking-wider"
                style={{ color }}
              >
                {caption.toUpperCase()}
              </p>
            )}

            <div className="mt-4 space-y-2">
              <Button
                onClick={handleDownload}
                disabled={!hasData}
                className="h-12 w-full text-base font-semibold"
              >
                <Download className="mr-2 h-5 w-5" />
                Download PNG
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleCopy}
                  disabled={!hasData}
                  variant="outline"
                  className="h-11"
                >
                  <Copy className="mr-1.5 h-4 w-4" />
                  Salin
                </Button>
                <Button
                  onClick={handleShare}
                  disabled={!hasData}
                  variant="outline"
                  className="h-11"
                >
                  <Share2 className="mr-1.5 h-4 w-4" />
                  Bagikan
                </Button>
              </div>
            </div>

            {!hasData && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Isi dulu kontennya di atas
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}