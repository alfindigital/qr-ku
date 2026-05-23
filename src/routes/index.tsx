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
    ],
  }),
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <BrandHeader />
      <QrGenerator />
      <Toaster position="top-center" />
    </main>
  );
}
