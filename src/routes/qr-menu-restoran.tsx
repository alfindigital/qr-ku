import { createFileRoute, Link } from "@tanstack/react-router";
import { Link as LinkIcon } from "lucide-react";
import { BrandHeader } from "@/components/qr/BrandHeader";

export const Route = createFileRoute("/qr-menu-restoran")({
  component: Page,
  head: () => ({
    meta: [
      { title: "QR Code Menu Digital untuk Restoran & Cafe — QRku" },
      { name: "description", content: "Bikin QR Menu digital gratis. Pelanggan scan, langsung buka menu di HP. Cocok untuk warung, cafe, hotel, dan restoran modern." },
      { property: "og:title", content: "QR Menu Restoran — Modern & Hemat Cetak" },
      { property: "og:description", content: "Link ke menu PDF/Google Drive/Instagram. Update kapan saja tanpa cetak ulang." },
      { property: "og:url", content: "https://qrku.alfindigital.com/qr-menu-restoran" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "https://qrku.alfindigital.com/qr-menu-restoran" }],
  }),
});

function Page() {
  return (
    <main className="min-h-screen bg-background">
      <BrandHeader />
      <article className="mx-auto max-w-3xl px-4 py-8 lg:py-12">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <LinkIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">QR Menu Digital Restoran</h1>
            <p className="text-sm text-muted-foreground">Ganti buku menu dengan QR — hemat cetak, mudah update.</p>
          </div>
        </div>
        <Link to="/" search={{ type: "url" }} className="mb-8 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90">
          Buat QR Menu Sekarang →
        </Link>
        <div className="space-y-4 text-sm">
          <h2 className="text-lg font-semibold">Kenapa Restoran Beralih ke QR Menu?</h2>
          <p className="text-muted-foreground">Cetak buku menu itu mahal, mudah kotor, dan sulit diupdate ketika harga atau varian berubah. Dengan QR menu, kamu tinggal update file sekali dan semua meja langsung ikut. Bonus: pelanggan bisa lihat foto menu dengan lebih jelas di layar mereka sendiri.</p>
          <h2 className="text-lg font-semibold">Pilihan Format Menu Digital</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li><strong>PDF di Google Drive:</strong> paling cepat & gratis. Upload PDF, ambil link share, tempel di form.</li>
            <li><strong>Google Sites / Notion:</strong> menu web sederhana, gratis, mobile-friendly.</li>
            <li><strong>Instagram highlight:</strong> pakai link ke highlight story yang berisi menu.</li>
            <li><strong>Website sendiri / GrabFood / GoFood:</strong> link langsung ke halaman pemesanan.</li>
          </ul>
          <h2 className="text-lg font-semibold">3 Langkah Cepat</h2>
          <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
            <li>Siapkan link menu (Google Drive PDF, website, dsb).</li>
            <li>Klik tombol di atas, paste link di kolom Alamat Website.</li>
            <li>Tambah teks "SCAN MENU" di bawah QR biar pelanggan tahu fungsinya, lalu Unduh.</li>
          </ol>
          <h2 className="text-lg font-semibold">Tips Placement</h2>
          <p className="text-muted-foreground">Cetak QR ukuran 8×8cm, laminating, tempel dengan tent card acrylic di setiap meja. Untuk cafe estetik, cetak di kertas kraft dengan bingkai kayu kecil.</p>
        </div>
      </article>
    </main>
  );
}
