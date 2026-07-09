import { createFileRoute, Link } from "@tanstack/react-router";
import { QrCode, Smartphone, Apple } from "lucide-react";
import { BrandHeader } from "@/components/qr/BrandHeader";

export const Route = createFileRoute("/contoh-qr-code")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Contoh QR Code & Cara Scan di Android/iPhone — QRku" },
      {
        name: "description",
        content:
          "Kumpulan contoh QR Code untuk menu restoran, kartu nama, WiFi, dan link, lengkap dengan cara scan QR di Android maupun iPhone tanpa aplikasi tambahan.",
      },
      { property: "og:title", content: "Contoh QR Code & Cara Scan (Android + iPhone)" },
      {
        property: "og:description",
        content:
          "Lihat contoh nyata QR Code untuk menu, WiFi, WhatsApp, kartu nama, plus panduan scan lewat kamera bawaan HP.",
      },
      { property: "og:url", content: "https://qrku.alfindigital.com/contoh-qr-code" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "https://qrku.alfindigital.com/contoh-qr-code" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Contoh QR Code & Cara Scan di Android/iPhone",
          author: { "@type": "Organization", name: "QRku" },
          publisher: { "@type": "Organization", name: "QRku" },
          datePublished: "2026-01-01",
          mainEntityOfPage: "https://qrku.alfindigital.com/contoh-qr-code",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Apakah scan QR code butuh aplikasi khusus?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Tidak. Semua HP Android (versi 8 ke atas) dan iPhone (iOS 11 ke atas) sudah bisa scan QR langsung dari aplikasi Kamera bawaan.",
              },
            },
            {
              "@type": "Question",
              name: "Kenapa QR code saya tidak terbaca?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Umumnya karena kontras kurang (warna QR terlalu terang di background gelap), ukuran cetak terlalu kecil (minimal 2×2 cm), atau pantulan cahaya. Cetak hitam-putih dengan margin putih di sekelilingnya untuk hasil paling stabil.",
              },
            },
            {
              "@type": "Question",
              name: "Apakah QR code bisa expired?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "QR code statis (seperti yang dibuat di QRku) tidak pernah expired karena datanya tersimpan langsung di pola gambar, bukan di server.",
              },
            },
          ],
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
            <QrCode className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Contoh QR Code & Cara Scan
            </h1>
            <p className="text-sm text-muted-foreground">
              Contoh nyata penggunaan QR Code + panduan scan di Android & iPhone tanpa aplikasi tambahan.
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="mb-10 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
        >
          Buat QR Code Gratis →
        </Link>

        <div className="space-y-6 text-sm">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Contoh Penggunaan QR Code</h2>
            <p className="text-muted-foreground">
              QR Code sudah jadi bagian keseharian — dari bayar parkir sampai daftar hadir acara. Berikut contoh
              paling umum yang bisa langsung kamu tiru untuk usaha kamu:
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              <li className="rounded-lg border bg-card p-4">
                <div className="font-semibold text-foreground">📖 Menu Restoran</div>
                <p className="mt-1 text-muted-foreground">
                  Tempel di meja, pelanggan scan → lihat menu digital. Hemat cetak dan mudah update harga.
                </p>
                <Link
                  to="/qr-menu-restoran"
                  className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                >
                  Panduan lengkap →
                </Link>
              </li>
              <li className="rounded-lg border bg-card p-4">
                <div className="font-semibold text-foreground">💬 WhatsApp Bisnis</div>
                <p className="mt-1 text-muted-foreground">
                  Scan langsung buka chat WA dengan pesan pembuka otomatis. Cocok di banner & kartu nama.
                </p>
                <Link
                  to="/qr-whatsapp"
                  className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                >
                  Panduan lengkap →
                </Link>
              </li>
              <li className="rounded-lg border bg-card p-4">
                <div className="font-semibold text-foreground">📶 WiFi Cafe/Hotel</div>
                <p className="mt-1 text-muted-foreground">
                  Tamu scan → langsung terhubung WiFi tanpa ketik password panjang.
                </p>
                <Link
                  to="/qr-wifi"
                  className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                >
                  Panduan lengkap →
                </Link>
              </li>
              <li className="rounded-lg border bg-card p-4">
                <div className="font-semibold text-foreground">👤 Kartu Nama Digital (vCard)</div>
                <p className="mt-1 text-muted-foreground">
                  Scan → data kontak lengkap langsung tersimpan di HP. Ganti tumpukan kartu nama kertas.
                </p>
                <Link
                  to="/qr-vcard"
                  className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                >
                  Panduan lengkap →
                </Link>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Contoh Lain di Kehidupan Sehari-hari</h2>
            <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground">
              <li><strong className="text-foreground">Pembayaran QRIS</strong> — scan untuk transfer ke merchant.</li>
              <li><strong className="text-foreground">Absensi kelas / event</strong> — peserta scan untuk isi form kehadiran.</li>
              <li><strong className="text-foreground">Tiket & boarding pass</strong> — QR di HP dipindai petugas.</li>
              <li><strong className="text-foreground">Feedback pelanggan</strong> — scan QR di struk untuk isi survey.</li>
              <li><strong className="text-foreground">Sosial media</strong> — QR menuju Instagram/TikTok toko.</li>
              <li><strong className="text-foreground">Katalog produk PDF</strong> — QR di banner mengarah ke daftar harga terbaru.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Cara Scan QR Code di Android</h2>
            </div>
            <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
              <li>Buka aplikasi <strong className="text-foreground">Kamera</strong> bawaan HP.</li>
              <li>Arahkan kamera ke QR Code — tidak perlu menekan tombol foto.</li>
              <li>Tunggu 1–2 detik sampai muncul notifikasi/banner link di layar.</li>
              <li>Ketuk notifikasi tersebut untuk membuka isi QR (link, chat WA, dsb).</li>
            </ol>
            <p className="text-muted-foreground">
              Jika kamera tidak mendeteksi, buka <strong className="text-foreground">Pengaturan Kamera → Google Lens / Pemindai QR</strong> dan aktifkan. Di Xiaomi/Redmi cari "Scan QR Code" di menu kamera. Sebagai alternatif, aplikasi <strong className="text-foreground">Google Lens</strong> selalu bisa memindai QR.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Apple className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Cara Scan QR Code di iPhone</h2>
            </div>
            <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
              <li>Buka aplikasi <strong className="text-foreground">Kamera</strong> (bukan aplikasi pihak ketiga).</li>
              <li>Arahkan ke QR Code sampai kotak kuning muncul di layar.</li>
              <li>Ketuk banner kuning di atas layar untuk membuka isi QR.</li>
            </ol>
            <p className="text-muted-foreground">
              Fitur ini aktif otomatis sejak iOS 11. Jika tidak jalan, cek <strong className="text-foreground">Pengaturan → Kamera → Scan QR Codes</strong> dan pastikan aktif. Kamu juga bisa pakai <strong className="text-foreground">Control Center → Code Scanner</strong> untuk akses lebih cepat.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Tips agar QR Code Mudah Discan</h2>
            <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground">
              <li>Ukuran cetak minimal <strong className="text-foreground">2×2 cm</strong> untuk jarak dekat, <strong className="text-foreground">10×10 cm</strong> untuk banner.</li>
              <li>Kontras tinggi — QR gelap di background terang paling stabil.</li>
              <li>Beri <strong className="text-foreground">margin putih</strong> (quiet zone) di sekitar QR, minimal selebar 4 modul.</li>
              <li>Hindari melipat atau menaruh QR di permukaan mengkilap.</li>
              <li>Untuk cetak besar, unduh format <strong className="text-foreground">SVG</strong> agar tidak pecah.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Pertanyaan Umum</h2>
            <div className="space-y-3">
              <div className="rounded-lg border bg-card p-4">
                <div className="font-semibold text-foreground">Apakah scan QR code butuh aplikasi khusus?</div>
                <p className="mt-1 text-muted-foreground">Tidak. Android 8+ dan iPhone iOS 11+ sudah bisa scan lewat kamera bawaan.</p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="font-semibold text-foreground">Kenapa QR code saya tidak terbaca?</div>
                <p className="mt-1 text-muted-foreground">Cek kontras, ukuran, margin putih, dan pantulan cahaya. Cetak hitam-putih paling aman.</p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="font-semibold text-foreground">Apakah QR code bisa expired?</div>
                <p className="mt-1 text-muted-foreground">QR statis QRku tidak expired — datanya tertanam di pola gambar, bukan di server.</p>
              </div>
            </div>
          </section>

          <div className="rounded-xl border bg-primary/5 p-5 text-center">
            <p className="mb-3 text-muted-foreground">Siap bikin QR Code untuk usaha kamu?</p>
            <Link
              to="/"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
            >
              Buat QR Code Gratis →
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}