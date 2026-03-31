# Dummy Seed Data (Klinik Indonesia)

Gunakan data berikut untuk bootstrap awal.

## Users

| user_id | nama | email | role | status |
|---|---|---|---|---|
| usr_owner_01 | Pemilik Klinik | owner@klinikmaju.id | pemilik | aktif |
| usr_admin_01 | Admin Klinik | admin@klinikmaju.id | admin_klinik | aktif |
| usr_cs_01 | CS Klinik | cs@klinikmaju.id | cs | aktif |
| usr_keu_01 | Staff Keuangan | finance@klinikmaju.id | keuangan | aktif |
| usr_medis_01 | Bidan Jaga | medis@klinikmaju.id | medis | aktif |

## Pasien

| pasien_id | no_rm | nama | nik | hp | status_bpjs |
|---|---|---|---|---|---|
| pas_0001 | RM-20260331-0001 | Aisyah Putri | 3174xxxxxxxxxxxx | 081234567890 | Aktif |
| pas_0002 | RM-20260331-0002 | Rina Lestari | 3273xxxxxxxxxxxx | 082112223334 | Tidak Aktif |

## Antrian

| id_antrian | tanggal | pasien_id | layanan | status |
|---|---|---|---|---|
| antri_0001 | 2026-03-31 | pas_0001 | ANC | Menunggu |
| antri_0002 | 2026-03-31 | pas_0002 | Pemeriksaan Umum | Diperiksa |

## Reminder

| reminder_id | pasien_id | nama | no_wa | jenis | waktu | status |
|---|---|---|---|---|---|---|
| rem_0001 | pas_0001 | Aisyah Putri | 081234567890 | Kontrol ANC | 2026-04-07 | Belum Dihubungi |

## Keuangan

| transaksi_id | tanggal | jenis | kategori | nominal | keterangan |
|---|---|---|---|---:|---|
| trx_0001 | 2026-03-31 | Masuk | Pasien Periksa | 350000 | Pemeriksaan ANC |
| trx_0002 | 2026-03-31 | Keluar | Beli Obat / Farmasi | 120000 | Restock vitamin |

## Karyawan

| karyawan_id | nama | posisi | kontak | jadwal | status_aktif |
|---|---|---|---|---|---|
| kar_0001 | Nurul Hidayah | Bidan | 081298761234 | Shift Pagi | Aktif |
| kar_0002 | Rudi Santoso | Admin | 081355554444 | Shift Siang | Aktif |

## Absensi

| absensi_id | tanggal | karyawan_id | status | lembur_jam | catatan |
|---|---|---|---|---:|---|
| abs_0001 | 2026-03-31 | kar_0001 | Hadir | 0 | - |
| abs_0002 | 2026-03-31 | kar_0002 | Lembur | 2 | Tutup buku bulanan |

## Content Landing

### Hero_Content
`hero_01, Solusi Klinik End-to-End, Kelola operasional klinik lebih cepat, Dashboard modern berbasis cloud, Coba Demo, /login, Konsultasi, https://wa.me/6281234567890, true`

### Feature_Items
- Antrian real-time
- Rekam medis ringkas
- Reminder WhatsApp
- Laporan klinik

### Pricing_Plans
- Starter / Growth / Enterprise
