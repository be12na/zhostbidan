# GAS Setup File Map

Berikut file yang perlu Anda copy ke project Google Apps Script:

- `gas/App.gs` → entrypoint `doGet/doPost/doOptions`
- `gas/Config.gs` → konfigurasi sheet + mapping resource
- `gas/Router.gs` → dispatcher `resource/action`
- `gas/Response.gs` → format response JSON standar
- `gas/Utils.gs` → helper spreadsheet, id, sanitize, audit
- `gas/Validators.gs` → validasi payload/role/email
- `gas/Auth.gs` → login
- `gas/Users.gs` → users CRUD
- `gas/Patients.gs` → pasien CRUD + search
- `gas/Queue.gs` → antrian list/create/update
- `gas/Examinations.gs` → pemeriksaan list/create/update
- `gas/Reminders.gs` → reminder list/create/update
- `gas/Finance.gs` → keuangan list/create/update
- `gas/Employees.gs` → karyawan list/create/update
- `gas/Attendance.gs` → absensi list/create/update
- `gas/Reports.gs` → laporan list/create/update by type
- `gas/Content.gs` → content list/create/update by type
- `gas/SetupSheets.gs` → **setup/import utility** (`setupAllSheets()`, `seedInitialData()`)

## Urutan setup tercepat

1. Buat project GAS baru.
2. Copy semua file dari folder `gas/` ke project GAS.
3. Isi `GAS_CONFIG.SPREADSHEET_ID` di `Config.gs`.
4. Jalankan `setupAllSheets()` sekali.
5. (Opsional) jalankan `seedInitialData()`.
6. Deploy Web App.
