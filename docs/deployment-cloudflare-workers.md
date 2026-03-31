# Deploy ke Cloudflare Workers (Primary)

Panduan ini adalah alur utama deploy project ini.

## Arsitektur Deploy

- Worker melayani **static assets** hasil build Vite (`dist/`) melalui binding `ASSETS`.
- Route `/api/proxy` ditangani Worker dan diteruskan ke Google Apps Script Web App.
- Frontend tetap memakai kontrak existing: `VITE_API_BASE_URL=/api/proxy`.

## 1) Persiapan

```bash
npm install
```

Siapkan frontend env:

```bash
cp .env.example .env
```

Isi local worker vars (opsional dev lokal):

```bash
cp .dev.vars.example .dev.vars
```

## 2) Setup Google Apps Script

1. Copy folder `gas/` ke project GAS.
2. Isi `GAS_CONFIG.SPREADSHEET_ID` di `gas/Config.gs`.
3. Deploy sebagai Web App.
4. Ambil URL deployment GAS.

## 3) Konfigurasi Wrangler

File `wrangler.toml` sudah disiapkan:

- `name = "zhostbidan"`
- `main = "worker/index.ts"`
- assets binding ke `dist`
- SPA fallback aktif (`not_found_handling = "single-page-application"`)

Set variable runtime:

- `GAS_BASE_URL` (wajib)
- `ALLOWED_ORIGIN` (wajib untuk CORS ketat), default diset ke `bidan.zhost.digital`
- `API_TIMEOUT_MS` (opsional)

Set secret (jika dipakai):

```bash
wrangler secret put GAS_API_KEY
```

## 4) Jalankan Lokal

```bash
npm run worker:dev
```

## 5) Validasi Deploy Plan

```bash
npm run worker:check
```

## 6) Deploy Production

```bash
npm run worker:deploy
```

## 7) Staging (opsional)

Gunakan env staging di wrangler:

```bash
wrangler deploy --env staging
```

## 8) Smoke Test

1. `GET /` load SPA.
2. Pastikan app berjalan pada domain `https://bidan.zhost.digital`.
3. Login dengan email aktif di sheet `Users`.
4. Cek request frontend ke `/api/proxy` berhasil.
5. Cek create/update data masuk ke Google Sheets.
6. Cek timeout/error API menampilkan response error yang jelas.

## Catatan Kompatibilitas Runtime

- Worker entrypoint hanya memakai Web Standard APIs (`fetch`, `Request`, `Response`, `URL`).
- Tidak menggunakan `fs`, `path`, `http`, `net`, atau API Node lain.
- Tidak mengubah kontrak payload existing frontend ke backend.
