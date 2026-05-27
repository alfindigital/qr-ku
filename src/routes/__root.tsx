import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Globe, Facebook, Youtube, Send } from "lucide-react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "QRku — QR Code Generator Gratis" },
      { name: "description", content: "Buat QR Code gratis tanpa login untuk WhatsApp, link, dan toko. Kustom warna, logo, dan bentuk." },
      { property: "og:title", content: "QRku — QR Code Generator Gratis untuk UMKM" },
      { property: "og:description", content: "Buat QR Code dari link, WhatsApp, atau tulisan. Mudah, cepat, dan gratis." },
      { property: "og:site_name", content: "QRku" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "QRku — QR Code Generator Gratis untuk UMKM" },
      { name: "twitter:description", content: "Buat QR Code dari link, WhatsApp, atau tulisan. Mudah, cepat, dan gratis." },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                if (!theme || theme === 'system') {
                  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  }
                } else if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <Outlet />
        <footer className="mt-auto px-4 pb-6 pt-4 sm:px-6">
          <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <span>
              by{" "}
              <span className="font-medium text-foreground">@alfindigital</span>
            </span>
            <span className="text-muted-foreground/50">|</span>
            <div className="flex items-center gap-2">
              <a href="https://alfindigital.com" target="_blank" rel="noreferrer" aria-label="Website" className="transition-colors hover:text-foreground">
                <Globe className="h-3.5 w-3.5" />
              </a>
              <a href="https://facebook.com/alfindigital" target="_blank" rel="noreferrer" aria-label="Facebook" className="transition-colors hover:text-foreground">
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <a href="https://youtube.com/@alfindigital" target="_blank" rel="noreferrer" aria-label="YouTube" className="transition-colors hover:text-foreground">
                <Youtube className="h-3.5 w-3.5" />
              </a>
              <a href="https://tiktok.com/@alfindigital" target="_blank" rel="noreferrer" aria-label="TikTok" className="transition-colors hover:text-foreground">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.93a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.84-.31z"/></svg>
              </a>
              <a href="https://x.com/alfindigital" target="_blank" rel="noreferrer" aria-label="X" className="transition-colors hover:text-foreground">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://t.me/alfindigital" target="_blank" rel="noreferrer" aria-label="Telegram" className="transition-colors hover:text-foreground">
                <Send className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}
