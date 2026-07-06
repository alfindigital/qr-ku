import { createFileRoute, Link } from "@tanstack/react-router";
import { Wifi } from "lucide-react";
import { BrandHeader } from "@/components/qr/BrandHeader";

export const Route = createFileRoute("/qr-wifi")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Cara Buat QR Code WiFi untuk Cafe & Toko — QRku" },
      { name: "description", content: "Bikin QR Code WiFi gratis dalam 30 detik. Pelanggan tinggal scan, langsung terhubung tanpa ketik password." },
      { property: "og:title", content: "QR Code WiFi Gratis — Scan Langsung Konek" },
      { property: "og:description", content: "Format WPA/WEP/tanpa password, hidden SSID, download PNG/SVG. 100% gratis." },
      { property: "og:url", content: "https://qrku.alfindigital.com/qr-wifi" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "https://qrku.alfindigital.com/qr-wifi" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Cara Buat QR Code WiFi untuk Cafe & Toko",
          author: { "@type": "Organization", name: "QRku" },
          publisher: { "@type": "Organization", name: "QRku" },
          datePublished: "2026-01-01",
          mainEntityOfPage: "https://qrku.alfindigital.com/qr-wifi",
        }),
      },
    ],
  }),
});

function Page() {
  return (
    <main className="min-h-screen bg-background">
      <BrandHeader />
      <article className="mx-auto max-w-3xl px-4 py-8 lg:py-12">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Wifi className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">QR Code WiFi Gratis</h1>
            <p className="text-sm text-muted-foreground">Scan sekali, langsung terhubung — tanpa ketik password.</p>
          </div>
        </div>
        <Link to="/" search={{ type: "wifi" }} className="mb-8 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90">
          Buat QR WiFi Sekarang →
        </Link>
        <div className="space-y-4 text-sm">
          <h2 className="text-lg font-semibold">Kenapa Pakai QR Code WiFi?</h2>
          <p className="text-muted-foreground">Pelanggan cafe, tamu kantor, atau pengunjung acara tidak perlu lagi mengetik nama jaringan dan password panjang. Cukup buka kamera HP, arahkan ke QR, dan tap notifikasi Sambungkan ke jaringan. Hemat waktu staf, tidak ada salah ketik password, dan terlihat lebih profesional.</p>
          <h2 className="text-lg font-semibold">Cara Membuat QR WiFi (3 Langkah)</h2>
          <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
            <li>Klik tombol di atas — form WiFi terbuka otomatis.</li>
            <li>Isi Nama WiFi (SSID) persis sama dengan yang muncul di router (case-sensitive), lalu password. Pilih WPA untuk hampir semua router modern. Kalau hotspot tanpa password, pilih Tanpa Password.</li>
            <li>Klik Unduh. Pilih PNG untuk cetak biasa, atau SVG/PDF untuk cetak besar tanpa pecah.</li>
          </ol>
          <h2 className="text-lg font-semibold">Tips Cetak QR WiFi</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Ukuran minimal 5×5cm supaya bisa di-scan dari jarak 30cm.</li>
            <li>Beri kontras warna tinggi (hitam di atas putih paling aman).</li>
            <li>Tambah teks bantuan seperti SCAN WIFI agar orang tahu fungsinya.</li>
            <li>Untuk cafe: laminating atau bingkai acrylic supaya tahan tumpahan.</li>
          </ul>
          <h2 className="text-lg font-semibold">Apakah Aman?</h2>
          <p className="text-muted-foreground">Password WiFi tersimpan di dalam QR sebagai teks (format resmi standar). Siapa pun yang scan bisa terhubung — jadi jangan pajang QR di area publik kalau jaringan berisi data sensitif. Untuk tamu, buat jaringan terpisah (guest network) di router.</p>
        </div>
      </article>
    </main>
  );
}