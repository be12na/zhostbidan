# KlinikApp Refactor (Cloudflare Workers + Google Sheets + GAS)

Refactor production-ready dari codebase monolitik legacy (`legacy_index.html`) menjadi arsitektur modular yang siap deploy ke **Cloudflare Workers**.

Target deploy saat ini:
- Worker name: `zhostbidan`
- Allowed origin domain: `bidan.zhost.digital`

- **Frontend**: React + Vite + TypeScript
- **Runtime deploy utama**: Cloudflare Workers (static assets + API proxy di satu Worker)
- **Data store**: Google Sheets
- **API layer**: Google Apps Script Web App (modular handlers)

## Fitur Utama

- Landing page data-driven (hero/features/pricing dari Sheets)
- Login email + role-based access
- Dashboard operasional modular:
  - Antrian
  - Pasien
  - Pemeriksaan
  - Reminder (dengan WhatsApp link)
  - Keuangan
  - HRD + Absensi
  - Laporan klinik multi-jenis
  - Hak akses user
  - Editable content
- Service layer API terpisah per resource
- Reusable UI: table/modal/form/loading/empty/error

## Struktur Folder

```txt
src/
  components/ui
  constants
  hooks
  layouts
  lib
  modules/
    auth content examinations finance hrd patients queue reminders reports
  pages
  routes
  services/api
  types
  utils

gas/
  App.gs
  Config.gs
  Router.gs
  Response.gs
  Utils.gs
  Validators.gs
  Auth.gs
  Users.gs
  Patients.gs
  Queue.gs
  Examinations.gs
  Reminders.gs
  Finance.gs
  Employees.gs
  Attendance.gs
  Reports.gs
  Content.gs

worker/
  index.ts

functions/api/proxy.ts   # legacy optional (Pages Functions)
docs/
```

## Setup Lokal

1. Install dependency

```bash
npm install
```

2. Copy env frontend

```bash
cp .env.example .env
```

3. (Opsional) copy env worker local

```bash
cp .dev.vars.example .dev.vars
```

4. Build frontend

```bash
npm run build
```

5. Jalankan Worker lokal (serve assets dist + proxy API)

```bash
npm run worker:dev
```

## Scripts

- `npm run dev` — frontend vite dev
- `npm run build` — build frontend (`dist`)
- `npm run lint` — lint project (`src`, `functions`, `worker`)
- `npm run worker:dev` — build lalu wrangler dev
- `npm run worker:check` — build lalu dry-run deploy
- `npm run worker:deploy` — build lalu deploy ke Workers

## Dokumentasi Tambahan

- `docs/google-sheets-schema.md`
- `docs/api-endpoints.md`
- `docs/deployment-cloudflare-workers.md` (utama)
- `docs/deployment-cloudflare-pages.md` (opsional legacy)
- `docs/refactor-audit.md`
- `docs/seed-data.md`
