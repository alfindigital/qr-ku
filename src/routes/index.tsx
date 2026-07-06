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
