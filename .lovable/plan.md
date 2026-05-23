
# QR Code Generator — Plan

Aplikasi 1 halaman, mobile-first, bahasa Indonesia sederhana. Cocok untuk warung, toko kecil, dan event di desa. Tanpa login, tanpa backend — semua jalan di browser.

## Prinsip
- **Mobile-first**: layout vertikal, tombol besar, font jelas.
- **Bahasa simpel**: "Link Website", "WhatsApp", "Tulisan" — bukan istilah teknis.
- **Hasil instan**: QR ter-update otomatis tiap input berubah (live preview).
- **Tanpa login, tanpa simpan data**: semua di sisi browser.

## Fitur Inti (yang penting saja)

### 1. Tipe Konten (3 tab saja)
- **Link Website** — input URL (auto-tambah `https://` kalau lupa)
- **WhatsApp** — input nomor HP (auto-format `62...`) + pesan opsional → generate `wa.me/62xxx?text=...`
- **Tulisan** — bebas (alamat warung, info promo, dll)

Tidak perlu: vCard, WiFi, PDF, Event, dll — terlalu rumit untuk target user.

### 2. Kustomisasi (minimal, jelas)
- **Warna QR**: 6 preset warna (hitam, biru, hijau, merah, ungu, oranye) + color picker
- **Warna Background**: putih / transparan
- **Bentuk titik (dots)**: kotak / bulat / rounded (3 pilihan saja)
- **Logo di tengah**: upload gambar dari HP (opsional) — auto-resize & beri ruang putih
- **Teks di bawah QR**: opsional (misal "SCAN MENU" atau nama warung)

### 3. Output
- **Tombol Download PNG** (resolusi tinggi 1024px, siap cetak)
- **Tombol Salin Gambar** (copy to clipboard untuk paste ke WA/IG)
- **Tombol Bagikan** (Web Share API native — share langsung ke WA di HP)

## Struktur Halaman (mobile-first)

```text
┌─────────────────────────┐
│  Header (logo + judul)  │
├─────────────────────────┤
│  [Link] [WA] [Tulisan]  │  ← tab pilih tipe
├─────────────────────────┤
│  Input field besar      │
├─────────────────────────┤
│   ┌───────────────┐     │
│   │   QR PREVIEW  │     │  ← live, di tengah
│   │   (+ teks)    │     │
│   └───────────────┘     │
├─────────────────────────┤
│  Kustomisasi (collapse) │
│   - Warna (swatches)    │
│   - Bentuk titik        │
│   - Logo (upload)       │
│   - Teks bawah          │
├─────────────────────────┤
│ [Download] [Salin] [Bagi]│
└─────────────────────────┘
```

Di desktop: 2 kolom (kiri input+kustomisasi, kanan preview sticky).

## Stack Teknis

- **Library QR**: `qr-code-styling` (npm) — sudah support warna, bentuk dots, logo embed, export PNG. Ringan, no backend.
- **Route**: ganti isi `src/routes/index.tsx` (homepage). Komponen dipecah:
  - `src/components/qr/TypeTabs.tsx`
  - `src/components/qr/ContentInput.tsx` (switch berdasarkan tipe)
  - `src/components/qr/QrPreview.tsx` (wrap qr-code-styling)
  - `src/components/qr/Customizer.tsx` (warna, bentuk, logo, teks)
  - `src/components/qr/ActionButtons.tsx` (download/salin/share)
- **State**: `useState` lokal — tidak butuh global store.
- **UI**: shadcn (Tabs, Input, Button, Slider, Label, Collapsible) + Tailwind.

## Design Direction

- **Vibe**: bersih, ramah, sedikit playful — bukan korporat. Warna aksen hijau WhatsApp-ish biar familiar untuk user desa.
- **Typography**: font sans-serif tebal untuk heading (jelas dibaca), body normal.
- **Tombol besar** (min 44px tinggi) untuk jempol.
- Semua warna pakai design tokens di `src/styles.css` (oklch).

## SEO

- Title: "QR Code Generator Gratis — Buat QR untuk WA, Link & Toko"
- Meta description Indonesia, H1 jelas, lang="id".

## Yang TIDAK dibuat (sengaja)
- Login / akun
- History QR / simpan ke cloud
- QR dinamis (butuh backend)
- vCard, WiFi, Event, PDF, Video, Social, 2D Barcode
- Frame template (rumit; cukup teks di bawah saja)

## Langkah Implementasi
1. Install `qr-code-styling`
2. Setup design tokens (warna brand hijau + netral) di `styles.css`
3. Bangun komponen QR & preview live
4. Tambah input per tipe (URL/WA/Teks) dengan validasi ringan
5. Customizer (warna preset, bentuk, logo upload, teks)
6. Action buttons (download PNG, copy clipboard, web share)
7. SEO meta + responsive polish
