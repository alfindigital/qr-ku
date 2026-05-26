import { createFileRoute, Link } from "@tanstack/react-router";
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
      <h1 className="sr-only">QR Code Generator Gratis untuk UMKM Indonesia</h1>
      <QrGenerator />
      <footer className="border-t border-border bg-muted/50 py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>QRku — QR Code Generator Gratis</span>
          <Link
            to="/seo-checklist"
            className="underline-offset-2 transition-colors hover:text-foreground hover:underline"
          >
            SEO Checklist
          </Link>
        </div>
      </footer>
      <Toaster position="top-center" />
    </main>
  );
}
