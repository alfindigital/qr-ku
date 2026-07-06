import { createFileRoute, Link } from "@tanstack/react-router";
import { User } from "lucide-react";
import { BrandHeader } from "@/components/qr/BrandHeader";

export const Route = createFileRoute("/qr-vcard")({
  component: Page,
  head: () => ({
    meta: [
      { title: "QR Code Kartu Nama Digital (vCard) — QRku" },
      { name: "description", content: "Bikin QR kartu nama digital gratis. Scan sekali, kontak langsung tersimpan di HP: nama, nomor, email, alamat, website." },
      { property: "og:title", content: "Kartu Nama Digital — Scan & Simpan Kontak" },
      { property: "og:description", content: "Format vCard standar, kompatibel iPhone & Android. Gratis tanpa login." },
      { property: "og:url", content: "https://qrku.alfindigital.com/qr-vcard" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "https://qrku.alfindigital.com/qr-vcard" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "QR Code Kartu Nama Digital (vCard)",
          author: { "@type": "Organization", name: "QRku" },
          publisher: { "@type": "Organization", name: "QRku" },
          datePublished: "2026-01-01",
          mainEntityOfPage: "https://qrku.alfindigital.com/qr-vcard",
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
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">QR Kartu Nama Digital (vCard)</h1>
            <p className="text-sm text-muted-foreground">Kartu nama modern — scan sekali, kontak langsung tersimpan.</p>
          </div>
        </div>
        <Link to="/" search={{ type: "vcard" }} className="mb-8 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90">
          Buat Kartu Nama QR Sekarang →
        </Link>
        <div className="space-y-4 text-sm">
          <h2 className="text-lg font-semibold">Apa Itu vCard?</h2>
          <p className="text-muted-foreground">vCard adalah format standar internasional untuk kartu kontak digital. Ketika seseorang scan QR vCard, HP mereka menawarkan menyimpan langsung ke kontak lengkap dengan nama, nomor, email, alamat, dan website. Tidak perlu ketik ulang manual — sekali scan, selamanya tersimpan.</p>
          <h2 className="text-lg font-semibold">Kenapa Lebih Baik dari Kartu Nama Kertas?</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Tidak hilang atau kucel di dompet.</li>
            <li>Bisa diupdate tanpa cetak ulang (kalau pakai link dinamis).</li>
            <li>Lebih ramah lingkungan.</li>
            <li>Kesan profesional & modern.</li>
            <li>Bisa ditempel di email signature, LinkedIn, atau layar kunci HP.</li>
          </ul>
          <h2 className="text-lg font-semibold">3 Langkah Membuat</h2>
          <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
            <li>Klik tombol di atas, form Kartu Nama terbuka otomatis.</li>
            <li>Isi nama (wajib), lalu nomor HP, email, organisasi, jabatan, alamat, website (opsional).</li>
            <li>Pilih warna sesuai brand, tambah logo perusahaan di tengah, Unduh SVG untuk cetak.</li>
          </ol>
          <h2 className="text-lg font-semibold">Dimana Menaruhnya?</h2>
          <p className="text-muted-foreground">Belakang kartu nama fisik (versi hybrid), signature email, lock screen HP saat networking event, banner LinkedIn, bagian About di website, atau print di tumbler pribadi.</p>
        </div>
      </article>
    </main>
  );
}
