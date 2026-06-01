## Yang akan dikerjakan

Menerapkan ide 1, 2, dan 3 dari diskusi sebelumnya ke QR Generator.

### 1. Tipe konten baru (Email, Telepon, Lokasi, WiFi)

Tambah 4 tab baru di `QrGenerator.tsx` selain Link / WhatsApp / Tulisan:

- **Email** → format `mailto:alamat@email.com?subject=...&body=...`
  - Input: alamat email, subjek (opsional), isi pesan (opsional)
- **Telepon** → format `tel:+62812...`
  - Input: nomor telepon (auto-normalisasi 0 → 62)
- **Lokasi** → format `geo:lat,lng` atau link Google Maps
  - Input: latitude, longitude, atau alternatif "tempel link Maps"
- **WiFi** → format `WIFI:T:WPA;S:NamaWifi;P:Password;;`
  - Input: nama jaringan (SSID), password, tipe keamanan (WPA/WEP/None), hidden (checkbox)

Karena tab jadi 7, ubah `TabsList` jadi grid 4 kolom × 2 baris di mobile, dan tetap responsif di desktop. Setiap tab pakai ikon Lucide (`Mail`, `Phone`, `MapPin`, `Wifi`).

Update `buildData()` agar menangani semua tipe baru, dan state form masing-masing (mis. `email`, `emailSubject`, `phone`, `lat`, `lng`, `wifiSsid`, dst).

### 2. Riwayat QR (localStorage)

- Simpan QR ke `localStorage` saat user menekan tombol Download (atau tombol baru "Simpan ke riwayat").
- Field yang disimpan: id, type, data mentah form, warna, bentuk, caption, timestamp.
- Tambah section "Riwayat QR" di bawah panel hasil (atau sebagai panel terpisah collapsible) yang menampilkan daftar QR tersimpan:
  - Thumbnail kecil (re-render dari data), label tipe, preview konten (truncate), tanggal.
  - Aksi: **Muat ulang** (isi kembali form), **Hapus**.
- Batas 20 entri terakhir (FIFO).
- Buat hook baru `src/hooks/use-qr-history.ts` untuk enkapsulasi load/save/delete.

### 3. Template cepat

- Tambah baris "Template cepat" di atas tab pilih jenis isi, berisi tombol chip:
  - **Menu Restoran** → tipe Link, placeholder URL menu digital.
  - **Kontak WhatsApp** → tipe WhatsApp, contoh nomor + pesan "Halo, saya mau pesan...".
  - **WiFi Cafe** → tipe WiFi dengan SSID/password placeholder.
  - **Info Toko** → tipe Tulisan dengan format nama + alamat.
  - **Email Bisnis** → tipe Email dengan subjek default.
- Klik template = set `type` + isi form dengan nilai contoh (user tinggal edit).
- Tombol berbentuk chip kecil horizontal-scroll di mobile.

## Catatan teknis

- File utama yang diubah: `src/components/qr/QrGenerator.tsx`.
- File baru: `src/hooks/use-qr-history.ts`, opsional `src/components/qr/QrHistory.tsx` dan `src/components/qr/QuickTemplates.tsx` agar `QrGenerator.tsx` tidak terlalu besar.
- Tidak ada perubahan backend — semua client-side (localStorage).
- Validasi input ringan: email format, nomor telepon angka, lat/lng numerik dengan range.

## Yang TIDAK dikerjakan sekarang

Ide 4–10 (frame dekoratif, batch, scan, format SVG/PDF, kustomisasi lanjut, share URL, analytics) ditunda.
