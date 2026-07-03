import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BrandHeader } from "@/components/qr/BrandHeader";
import { Button } from "@/components/ui/button";
import { useQrHistory, type QrHistoryItem } from "@/hooks/use-qr-history";
import { ChevronLeft, Copy, History as HistoryIcon, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
  head: () => ({
    meta: [
      { title: "Riwayat QR — QRku" },
      {
        name: "description",
        content: "Daftar QR yang pernah kamu simpan. Muat ulang ke editor, salin teks, atau hapus.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function HistoryPage() {
  const history = useQrHistory();
  const navigate = useNavigate();

  function editItem(it: QrHistoryItem) {
    try {
      const draft = {
        type: it.type,
        form: it.form,
        color: it.color,
        shape: it.shape,
        caption: it.caption,
      };
      localStorage.setItem("qrku:draft", JSON.stringify(draft));
      navigate({ to: "/" });
    } catch {
      toast.error("Gagal memuat ke editor");
    }
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Teks disalin");
    } catch {
      toast.error("Gagal menyalin");
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <BrandHeader />
      <div className="mx-auto w-full max-w-3xl px-3 py-6 sm:px-4 sm:py-8">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali ke generator
        </Link>

        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              <HistoryIcon className="h-6 w-6" />
              Riwayat QR
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {history.items.length} tersimpan di perangkat ini
            </p>
          </div>
          {history.items.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm("Hapus semua riwayat?")) history.clear();
              }}
            >
              Hapus semua
            </Button>
          )}
        </div>

        {history.items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 bg-card px-4 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Belum ada riwayat. Buat QR lalu klik <span className="font-medium text-foreground">Simpan</span>.
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Buka generator
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {history.items.map((it) => (
              <li
                key={it.id}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3"
              >
                <div
                  className="h-10 w-10 shrink-0 rounded-lg"
                  style={{ backgroundColor: it.color }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{it.label}</p>
                  <p className="truncate text-xs text-muted-foreground">{it.data}</p>
                  <p className="text-[11px] text-muted-foreground/70">
                    {new Date(it.createdAt).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => copyText(it.data)}
                    className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="Salin teks"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => editItem(it)}
                    className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="Muat ke editor"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Hapus riwayat ini?")) history.remove(it.id);
                    }}
                    className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}