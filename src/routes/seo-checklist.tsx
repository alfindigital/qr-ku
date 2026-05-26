import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandHeader } from "@/components/qr/BrandHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertTriangle, ChevronLeft, Shield, XCircle, Clock, Link2Off } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/seo-checklist")({
  component: SeoChecklistPage,
  head: () => ({
    meta: [
      { title: "SEO Checklist — Google Search Console Setup | QRku" },
      {
        name: "description",
        content:
          "On-page checklist for completing Google Search Console OAuth setup and fixing the remaining SEO finding for QRku.",
      },
    ],
  }),
});

function SeoChecklistPage() {
  return (
    <main className="min-h-screen bg-background">
      <BrandHeader />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali ke generator
        </Link>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            SEO Checklist
          </h1>
          <p className="mt-2 text-muted-foreground">
            Satu temuan SEO tersisa yang memerlukan persetujuan OAuth untuk diselesaikan.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">Status Google Search Console</CardTitle>
              <Badge variant="outline" className="border-destructive/40 bg-destructive/10 text-destructive">
                <XCircle className="mr-1 h-3.5 w-3.5" />
                Tidak Terhubung
              </Badge>
            </div>
            <CardDescription>
              Ringkasan status koneksi dan sinkronisasi data Search Console untuk situs ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Link2Off className="h-3.5 w-3.5" />
                Koneksi
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground">Belum dihubungkan</div>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Sinkronisasi terakhir
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground">Belum pernah</div>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5" />
                Verifikasi domain
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground">Menunggu</div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-base">Temuan Tersisa</CardTitle>
            </div>
            <CardDescription>
              Google Search Console belum terhubung — data performa pencarian dan pengiriman sitemap tidak tersedia.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
            Langkah-langkah yang Diperlukan
          </h2>
          <p className="text-sm text-muted-foreground">
            Untuk memperbaiki temuan ini, Anda perlu memberikan akses OAuth ke Google Search Console. Berikut penjelasan setiap langkah:
          </p>

          <Card>
            <CardContent className="pt-6">
              <ol className="space-y-6">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    1
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="step1" disabled />
                      <Label htmlFor="step1" className="font-medium">
                        Hubungkan Konektor Google Search Console
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Klik tombol "Fix" pada temuan SEO di panel Lovable. Ini akan membuka jendela pemilih konektor tempat Anda dapat memilih koneksi Google Search Console yang ada atau membuat yang baru.
                    </p>
                    <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                      <Shield className="h-4 w-4 shrink-0 text-primary" />
                      <span>
                        OAuth yang diminta: Google meminta izin untuk mengakses data Search Console Anda (melihat situs, data analitik, dan mengelola sitemap).
                      </span>
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    2
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="step2" disabled />
                      <Label htmlFor="step2" className="font-medium">
                        Verifikasi Kepemilikan Situs (META Tag)
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Setelah koneksi berhasil, sistem akan meminta token verifikasi dari Google. Token ini akan disematkan sebagai tag meta di halaman utama situs untuk membuktikan kepemilikan domain.
                    </p>
                    <div className="rounded-lg bg-muted p-3">
                      <code className="block text-xs text-muted-foreground">
                        &lt;meta name="google-site-verification" content="..." /&gt;
                      </code>
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    3
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="step3" disabled />
                      <Label htmlFor="step3" className="font-medium">
                        Konfirmasi Verifikasi &amp; Tambahkan Situs
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Setelah tag meta dideploy, sistem akan meminta Google untuk memverifikasi situs. Setelah terverifikasi, situs akan ditambahkan ke daftar properti Google Search Console Anda dan sitemap akan dikirim secara otomatis.
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Mengapa OAuth Diperlukan?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>
                  <strong className="text-foreground">Akses Data Privat:</strong> Google Search Console berisi data performa pencarian yang hanya dapat diakses oleh pemilik situs yang terverifikasi.
                </li>
                <li>
                  <strong className="text-foreground">Verifikasi Kepemilikan:</strong> Google perlu memastikan Anda adalah pemilik sah dari domain qrku.lovable.app sebelum mengizinkan pengelolaan sitemap dan data analitik.
                </li>
                <li>
                  <strong className="text-foreground">Izin Terbatas:</strong> OAuth hanya meminta izin read-only untuk Search Console. Agen Lovable tidak dapat membuat perubahan di akun Google Anda di luar konteks situs ini.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
