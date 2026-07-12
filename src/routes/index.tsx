import { createFileRoute } from "@tanstack/react-router";
import { QrGenerator } from "@/components/qr/QrGenerator";
import { BrandHeader } from "@/components/qr/BrandHeader";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "QR Code Generator Gratis — Buat QR untuk WA, Link & Toko" },
      {
        name: "description",
        content:
          "Buat QR Code gratis tanpa login. Cocok untuk warung, toko, dan event. Kustom warna, logo, dan bentuk. Download langsung.",
      },
      { property: "og:title", content: "QR Code Generator Gratis untuk UMKM" },
      {
        property: "og:description",
        content: "Buat QR Code dari link, WhatsApp, atau tulisan. Mudah dan cepat.",
      },
      { property: "og:url", content: "https://qrku.alfindigital.com/" },
    ],
    links: [
      { rel: "canonical", href: "https://qrku.alfindigital.com/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "QRku",
          url: "https://qrku.alfindigital.com/",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "QRku",
          url: "https://qrku.alfindigital.com/",
          logo: "https://qrku.alfindigital.com/favicon.svg",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Cara Membuat QR Code Gratis",
          description:
            "Panduan cepat membuat QR Code untuk link, WhatsApp, WiFi, atau kartu nama menggunakan QRku.",
          totalTime: "PT1M",
          step: [
            { "@type": "HowToStep", position: 1, name: "Pilih jenis QR", text: "Pilih jenis konten: URL, WhatsApp, WiFi, teks, atau vCard." },
            { "@type": "HowToStep", position: 2, name: "Isi data", text: "Masukkan data seperti link, nomor WhatsApp, atau nama WiFi & password." },
            { "@type": "HowToStep", position: 3, name: "Kustom tampilan", text: "Atur warna, bentuk, dan tambahkan logo di tengah QR." },
            { "@type": "HowToStep", position: 4, name: "Unduh QR", text: "Klik Unduh untuk menyimpan QR sebagai PNG atau SVG siap cetak." },
          ],
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
              name: "Apakah QRku benar-benar gratis?",
              acceptedAnswer: { "@type": "Answer", text: "Ya, QRku 100% gratis tanpa perlu login atau berlangganan. Semua fitur pembuatan dan unduhan tersedia bebas." },
            },
            {
              "@type": "Question",
              name: "Apakah QR Code yang dibuat akan kadaluarsa?",
              acceptedAnswer: { "@type": "Answer", text: "Tidak. QR Code yang dibuat bersifat statis dan berlaku selamanya selama link atau data tujuannya masih aktif." },
            },
            {
              "@type": "Question",
              name: "Format apa saja yang bisa diunduh?",
              acceptedAnswer: { "@type": "Answer", text: "Kamu bisa mengunduh QR Code dalam format PNG untuk kebutuhan digital dan SVG untuk cetak berkualitas tinggi tanpa pecah." },
            },
            {
              "@type": "Question",
              name: "Apakah bisa menambahkan logo ke QR Code?",
              acceptedAnswer: { "@type": "Answer", text: "Bisa. Unggah logo brand kamu, dan QRku akan menempatkannya di tengah QR tanpa mengganggu keterbacaan." },
            },
            {
              "@type": "Question",
              name: "Apakah data saya aman?",
              acceptedAnswer: { "@type": "Answer", text: "Aman. Semua QR Code dibuat langsung di browser kamu — tidak ada data yang dikirim atau disimpan di server QRku." },
            },
          ],
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <BrandHeader />
      <h1 className="sr-only">QR Code Generator Gratis untuk UMKM Indonesia</h1>
      <QrGenerator />
      <Toaster position="top-center" />
    </main>
  );
}
