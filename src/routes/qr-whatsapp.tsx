import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { BrandHeader } from "@/components/qr/BrandHeader";

export const Route = createFileRoute("/qr-whatsapp")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Cara Buat QR Code WhatsApp untuk Bisnis — QRku" },
      { name: "description", content: "Bikin QR Code WhatsApp gratis dengan pesan otomatis. Pelanggan scan langsung chat, cocok untuk UMKM, toko online, dan katalog produk." },
      { property: "og:title", content: "QR Code WhatsApp — Scan Langsung Chat" },
      { property: "og:description", content: "Auto-isi pesan pembuka, nomor otomatis normalize ke format +62. Gratis tanpa login." },
      { property: "og:url", content: "https://qrku.alfindigital.com/qr-whatsapp" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "https://qrku.alfindigital.com/qr-whatsapp" }],
  }),
});

function Page() {
  return (
    <main className="min-h-screen bg-background">
      <BrandHeader />
      <article className="mx-auto max-w-3xl px-4 py-8 lg:py-12">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">QR Code WhatsApp Bisnis</h1>
            <p className="text-sm text-muted-foreground">Pelanggan scan, chat kamu langsung terbuka dengan pesan siap kirim.</p>
          </div>
        </div>
        <Link to="/" search={{ type: "wa" }} className="mb-8 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90">
          Buat QR WhatsApp Sekarang →
        </Link>
        <div className="space-y-4 text-sm">
          <h2 className="text-lg font-semibold">Kenapa Perlu QR WhatsApp?</h2>
          <p className="text-muted-foreground">Tempel di banner, kartu nama, atau meja kasir — pelanggan yang tertarik tinggal scan. Nomor WA kamu tidak perlu diketik manual (sering typo), dan pesan pembuka bisa kamu atur seperti "Halo, saya mau pesan menu ayam bakar". Ini menghilangkan gesekan pertama sebelum transaksi.</p>
          <h2 className="text-lg font-semibold">3 Langkah Cepat</h2>
          <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
            <li>Klik tombol di atas untuk buka form WhatsApp otomatis.</li>
            <li>Ketik nomor WA (boleh awalan 0 atau 8, sistem konversi ke 62). Tambah pesan otomatis biar pelanggan tidak bingung mau ngomong apa duluan.</li>
            <li>Kustom warna & bentuk, lalu Unduh. Cetak SVG untuk hasil paling tajam.</li>
          </ol>
          <h2 className="text-lg font-semibold">Ide Pesan Otomatis yang Efektif</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li><strong>Restoran:</strong> "Halo, saya mau pesan/reservasi untuk..."</li>
            <li><strong>Toko online:</strong> "Halo, tanya stok produk: [nama produk]"</li>
            <li><strong>Jasa:</strong> "Halo, mau konsultasi tentang [layanan]"</li>
            <li><strong>Event:</strong> "Halo, mau daftar workshop tanggal..."</li>
          </ul>
          <h2 className="text-lg font-semibold">Tempat Ideal Menaruh QR WhatsApp</h2>
          <p className="text-muted-foreground">Meja kasir, banner outdoor, kartu nama, bagian belakang struk, thumbnail feed Instagram, sticker motor delivery, x-banner event, dan bagian bawah katalog PDF.</p>
        </div>
      </article>
    </main>
  );
}
