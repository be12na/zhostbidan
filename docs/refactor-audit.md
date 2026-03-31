# Refactor Audit: Legacy -> Production

## Basis Legacy

Sumber legacy utama: `legacy_index.html` (monolitik, semua fitur + state + UI dalam satu file).

## Dipertahankan

- Alur besar aplikasi: landing + dashboard internal
- Konsep role-based menu (`pemilik`, `admin_klinik`, `cs`, `keuangan`, `medis`)
- Domain module klinik:
  - pasien
  - antrian
  - pemeriksaan/diagnosa
  - reminder
  - keuangan
  - HRD/absensi
  - laporan klinik
  - hak akses
- Konsep export CSV

## Direfactor

- Monolitik menjadi modular (`src/modules/*`, `src/services/api/*`, `src/components/ui/*`)
- Login demo lokal menjadi login API (`auth/login`)
- Mock state lokal menjadi data API (GAS + Sheets)
- Form dan table dipisah menjadi komponen reusable
- Error/loading/empty state dijadikan pola konsisten
- Content landing menjadi editable via resource content

## Diganti Total

- Struktur frontend lama inline satu file -> aplikasi React+Vite TS modular
- Layer backend tidak ada -> backend GAS modular
- Integrasi deploy statis tanpa panduan -> Cloudflare Pages + docs deploy

## Dihapus / Tidak Dipakai Lagi

- Counter/template default Vite
- Hardcoded copy konten landing sebagai source tunggal
- Pengelolaan data utama berbasis state lokal in-memory

## Catatan Realistis

- Refactor ini mempertahankan domain flow lama, namun mengubah fondasi teknis menjadi production-oriented.
- Untuk hardening lanjutan disarankan:
  - menambahkan auth token signing di Worker
  - rate limiting edge berbasis durable store
  - test integration otomatis terhadap GAS endpoint
