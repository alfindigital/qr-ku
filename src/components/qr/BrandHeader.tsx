import { ThemeToggle } from "./ThemeToggle";

export function BrandHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-2.5 px-4">
        <BrandLogo />
        <span className="font-display text-2xl font-extrabold tracking-[-0.045em] text-brand">
          QRku
        </span>
        <div className="ml-auto flex items-center gap-2">
          <div id="header-actions-slot" className="flex items-center gap-2" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function BrandLogo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Three QR-style corner finders */}
      <rect x="1.5" y="1.5" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="2" className="text-primary" />
      <rect x="5" y="5" width="2" height="2" fill="currentColor" className="text-primary" />

      <rect x="17.5" y="1.5" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="2" className="text-primary" />
      <rect x="21" y="5" width="2" height="2" fill="currentColor" className="text-primary" />

      <rect x="1.5" y="17.5" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="2" className="text-primary" />
      <rect x="5" y="21" width="2" height="2" fill="currentColor" className="text-primary" />

      {/* data dots */}
      <rect x="14" y="14" width="2.5" height="2.5" fill="currentColor" className="text-primary" />
      <rect x="19" y="14" width="2.5" height="2.5" fill="currentColor" className="text-primary" />
      <rect x="24" y="14" width="2.5" height="2.5" fill="currentColor" className="text-primary" />
      <rect x="14" y="19" width="2.5" height="2.5" fill="currentColor" className="text-primary" />
      <rect x="19" y="19" width="2.5" height="2.5" fill="currentColor" className="text-primary" />
      <rect x="14" y="24" width="2.5" height="2.5" fill="currentColor" className="text-primary" />
      <rect x="24" y="24" width="2.5" height="2.5" fill="currentColor" className="text-primary" />
    </svg>
  );
}