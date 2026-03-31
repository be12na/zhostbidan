# Demo Dummy CSV Bundle (Google Sheets Ready)

Folder ini berisi data dummy realistis untuk 23 sheet schema aplikasi klinik.

## Isi Paket

- `Users.csv`
- `Pasien.csv`
- `Antrian.csv`
- `Pemeriksaan.csv`
- `Reminder.csv`
- `Keuangan.csv`
- `Karyawan.csv`
- `Absensi.csv`
- `Laporan_ANC.csv`
- `Laporan_Partus.csv`
- `Laporan_Bidan.csv`
- `Laporan_Dokter.csv`
- `Laporan_Kecantikan.csv`
- `Laporan_SHK.csv`
- `Laporan_Imunisasi.csv`
- `Laporan_KB.csv`
- `Site_Settings.csv`
- `Hero_Content.csv`
- `Feature_Items.csv`
- `Pricing_Plans.csv`
- `Audit_Log.csv`
- `Master_Layanan.csv`
- `Master_Kategori_Keuangan.csv`
- `summary.json`

## Cara Import ke Google Sheets

1. Buat spreadsheet baru.
2. Buat tab sheet dengan nama yang sama seperti file CSV.
3. Pada setiap tab, pilih `File > Import > Upload` lalu pilih file CSV yang sesuai.
4. Pilih mode import: **Replace current sheet**.
5. Ulangi hingga semua file CSV masuk.

## Catatan

- Data ini aman untuk demo/testing (bukan data pribadi asli).
- Relasi data sudah disusun konsisten (pasien-antrian-pemeriksaan-reminder-keuangan-absensi).
- Untuk regenerasi ulang paket (misal ingin refresh), jalankan:

```bash
node scripts/generate-demo-csv.mjs
```
