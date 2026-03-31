# Google Sheets Schema

Gunakan 1 Spreadsheet dengan sheet berikut dan header **persis** seperti di bawah.

## 1) Users
`user_id, nama, email, role, status, last_login, created_at, updated_at`

## 2) Pasien
`pasien_id, no_rm, nama, nik, tanggal_lahir, umur, jenis_kelamin, alamat, hp, no_bpjs, status_bpjs, satu_sehat_flag, last_visit, created_at, updated_at`

## 3) Antrian
`id_antrian, tanggal, pasien_id, nama_pasien, layanan, status, diagnosa_ringkas, analisa_ringkas, created_by, updated_at`

## 4) Pemeriksaan
`pemeriksaan_id, tanggal, pasien_id, antrian_id, dokter_id, tenaga_medis, diagnosa, analisa, tindakan, catatan, tgl_kembali, keperluan_kembali, created_at`

## 5) Reminder
`reminder_id, pasien_id, nama, no_wa, jenis, waktu, status, catatan_cs, created_at, updated_at`

## 6) Keuangan
`transaksi_id, tanggal, jenis, kategori, nominal, keterangan, pasien_id, antrian_id, created_by, created_at, updated_at`

## 7) Karyawan
`karyawan_id, nama, posisi, kontak, jadwal, status_aktif, created_at, updated_at`

## 8) Absensi
`absensi_id, tanggal, karyawan_id, status, lembur_jam, catatan, input_by, created_at`

## 9) Laporan_ANC
`id, tanggal, pasien, hpht, tp_uk, diagnosa, kspr, bb_tb, lila, hb, gol_darah, albumin, hiv, hepatitis_b, sifilis, buku_kia, keterangan, created_at`

## 10) Laporan_Partus
`id, tanggal, pasien, gpa, uk, bbl, pbl, jk_bayi, ku_ibu, vitamin_k, hb0, imd, vitamin_a, kb_pasca_salin, keterangan, created_at`

## 11) Laporan_Bidan
`id, tanggal, pasien, diagnosa, analisa, tindakan, catatan, created_at`

## 12) Laporan_Dokter
`id, tanggal, pasien, diagnosa, analisa, tindakan, resep, catatan, created_at`

## 13) Laporan_Kecantikan
`id, tanggal, pasien, tindakan, catatan, created_at`

## 14) Laporan_SHK
`id, tanggal, pasien, nama_bayi, tgl_lahir_bayi, faskes_lahir, jenis_kelamin, kembar, bb_bayi, pb_bayi, umur_kehamilan, kelainan_bawaan, pengobatan_bayi, obat_tiroid_ibu, faskes_sampel, tgl_sampel, lokasi_darah, transfusi, tgl_transfusi, keterangan, created_at`

## 15) Laporan_Imunisasi
`id, tanggal_input, no_rm_bayi, nama_bayi, nik_bayi, jk_bayi, tgl_lahir_bayi, nama_ibu, nik_ibu, hp_ibu, alamat_ibu, v_hb0, v_bcg, v_polio1, v_dpt1, v_pcv1, v_polio2, v_dpt2, v_pcv2, v_polio3, v_dpt3, v_polio4, v_ipv, v_campak, v_je, v_pcv3, v_dpt_baduta, v_campak_baduta, v_ipv2, v_ipv3, v_pcv4, v_ipv4, v_rotavirus1, v_rotavirus2, v_rotavirus3, created_at`

## 16) Laporan_KB
`id, tanggal, pasien, metode, jml_anak, usia_anak, anemia, lila, kronis, ims, keterangan, created_at`

## 17) Site_Settings
`key, value`

## 18) Hero_Content
`id, badge, title, subtitle, primary_cta_text, primary_cta_link, secondary_cta_text, secondary_cta_link, is_active`

## 19) Feature_Items
`id, icon, title, description, sort_order, is_active`

## 20) Pricing_Plans
`id, plan_name, billing_type, price, subtitle, features, cta_text, highlight_flag, is_active, sort_order`

## 21) Audit_Log
`log_id, action, resource, actor, detail, created_at`

## 22) Master_Layanan
`layanan_id, nama_layanan, status_aktif, sort_order`

## 23) Master_Kategori_Keuangan
`kategori_id, jenis, nama_kategori, status_aktif, sort_order`
