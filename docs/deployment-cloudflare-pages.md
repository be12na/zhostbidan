# Deploy ke Cloudflare Pages

## 1) Install dependency

```bash
npm install
```

## 2) Build lokal

```bash
npm run build
```

Output harus ada di folder `dist`.

## 3) Siapkan Google Apps Script

1. Buat project GAS, copy seluruh file dari folder `gas/`.
2. Isi `GAS_CONFIG.SPREADSHEET_ID` di `Config.gs`.
3. Deploy sebagai **Web App** (`Execute as: Me`, `Who has access: Anyone with link` atau sesuai kebijakan).
4. Simpan URL web app.

## 4) Pilih strategi endpoint frontend

### Opsi A (langsung ke GAS)
- Set `VITE_API_BASE_URL=<GAS_WEB_APP_URL>`

### Opsi B (recommended, via Cloudflare proxy)
- Gunakan `functions/api/proxy.ts`
- Set env Cloudflare:
  - `GAS_BASE_URL=<GAS_WEB_APP_URL>`
  - `GAS_API_KEY=<opsional>`
- Set `VITE_API_BASE_URL=/api/proxy`

## 5) Connect repo ke Cloudflare Pages

- Framework preset: **Vite**
- Build command: `npm run build`
- Build output directory: `dist`

## 6) Environment Variables (Pages)

- `VITE_API_BASE_URL`
- `VITE_APP_NAME`
- (jika proxy) `GAS_BASE_URL`, `GAS_API_KEY`

## 7) Routing SPA

Sudah disediakan file `public/_redirects`:

```txt
/* /index.html 200
```

## 8) Publish

Push ke branch connected; Cloudflare akan auto build + deploy.

## 9) Smoke Test

1. Login via email yang ada di sheet `Users`
2. Cek load data modul: Patients/Queue/Finance/HRD/Reports/Content
3. Cek create/update dari UI masuk ke Sheets
4. Cek response error UI (invalid email, timeout, required fields)
