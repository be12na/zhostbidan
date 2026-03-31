/**
 * Jalankan sekali di Google Apps Script untuk membuat seluruh sheet + header.
 *
 * Cara pakai:
 * 1) Isi GAS_CONFIG.SPREADSHEET_ID di Config.gs
 * 2) Jalankan setupAllSheets()
 * 3) (Opsional) jalankan seedInitialData()
 */

const SHEET_HEADERS = {
  Users: ['user_id', 'nama', 'email', 'role', 'status', 'last_login', 'created_at', 'updated_at'],
  Pasien: ['pasien_id', 'no_rm', 'nama', 'nik', 'tanggal_lahir', 'umur', 'jenis_kelamin', 'alamat', 'hp', 'no_bpjs', 'status_bpjs', 'satu_sehat_flag', 'last_visit', 'created_at', 'updated_at'],
  Antrian: ['id_antrian', 'tanggal', 'pasien_id', 'nama_pasien', 'layanan', 'status', 'diagnosa_ringkas', 'analisa_ringkas', 'created_by', 'updated_at'],
  Pemeriksaan: ['pemeriksaan_id', 'tanggal', 'pasien_id', 'antrian_id', 'dokter_id', 'tenaga_medis', 'diagnosa', 'analisa', 'tindakan', 'catatan', 'tgl_kembali', 'keperluan_kembali', 'created_at'],
  Reminder: ['reminder_id', 'pasien_id', 'nama', 'no_wa', 'jenis', 'waktu', 'status', 'catatan_cs', 'created_at', 'updated_at'],
  Keuangan: ['transaksi_id', 'tanggal', 'jenis', 'kategori', 'nominal', 'keterangan', 'pasien_id', 'antrian_id', 'created_by', 'created_at', 'updated_at'],
  Karyawan: ['karyawan_id', 'nama', 'posisi', 'kontak', 'jadwal', 'status_aktif', 'created_at', 'updated_at'],
  Absensi: ['absensi_id', 'tanggal', 'karyawan_id', 'status', 'lembur_jam', 'catatan', 'input_by', 'created_at'],
  Laporan_ANC: ['id', 'tanggal', 'pasien', 'hpht', 'tp_uk', 'diagnosa', 'kspr', 'bb_tb', 'lila', 'hb', 'gol_darah', 'albumin', 'hiv', 'hepatitis_b', 'sifilis', 'buku_kia', 'keterangan', 'created_at'],
  Laporan_Partus: ['id', 'tanggal', 'pasien', 'gpa', 'uk', 'bbl', 'pbl', 'jk_bayi', 'ku_ibu', 'vitamin_k', 'hb0', 'imd', 'vitamin_a', 'kb_pasca_salin', 'keterangan', 'created_at'],
  Laporan_Bidan: ['id', 'tanggal', 'pasien', 'diagnosa', 'analisa', 'tindakan', 'catatan', 'created_at'],
  Laporan_Dokter: ['id', 'tanggal', 'pasien', 'diagnosa', 'analisa', 'tindakan', 'resep', 'catatan', 'created_at'],
  Laporan_Kecantikan: ['id', 'tanggal', 'pasien', 'tindakan', 'catatan', 'created_at'],
  Laporan_SHK: ['id', 'tanggal', 'pasien', 'nama_bayi', 'tgl_lahir_bayi', 'faskes_lahir', 'jenis_kelamin', 'kembar', 'bb_bayi', 'pb_bayi', 'umur_kehamilan', 'kelainan_bawaan', 'pengobatan_bayi', 'obat_tiroid_ibu', 'faskes_sampel', 'tgl_sampel', 'lokasi_darah', 'transfusi', 'tgl_transfusi', 'keterangan', 'created_at'],
  Laporan_Imunisasi: ['id', 'tanggal_input', 'no_rm_bayi', 'nama_bayi', 'nik_bayi', 'jk_bayi', 'tgl_lahir_bayi', 'nama_ibu', 'nik_ibu', 'hp_ibu', 'alamat_ibu', 'v_hb0', 'v_bcg', 'v_polio1', 'v_dpt1', 'v_pcv1', 'v_polio2', 'v_dpt2', 'v_pcv2', 'v_polio3', 'v_dpt3', 'v_polio4', 'v_ipv', 'v_campak', 'v_je', 'v_pcv3', 'v_dpt_baduta', 'v_campak_baduta', 'v_ipv2', 'v_ipv3', 'v_pcv4', 'v_ipv4', 'v_rotavirus1', 'v_rotavirus2', 'v_rotavirus3', 'created_at'],
  Laporan_KB: ['id', 'tanggal', 'pasien', 'metode', 'jml_anak', 'usia_anak', 'anemia', 'lila', 'kronis', 'ims', 'keterangan', 'created_at'],
  Site_Settings: ['key', 'value'],
  Hero_Content: ['id', 'badge', 'title', 'subtitle', 'primary_cta_text', 'primary_cta_link', 'secondary_cta_text', 'secondary_cta_link', 'is_active'],
  Feature_Items: ['id', 'icon', 'title', 'description', 'sort_order', 'is_active'],
  Pricing_Plans: ['id', 'plan_name', 'billing_type', 'price', 'subtitle', 'features', 'cta_text', 'highlight_flag', 'is_active', 'sort_order'],
  Audit_Log: ['log_id', 'action', 'resource', 'actor', 'detail', 'created_at'],
  Master_Layanan: ['layanan_id', 'nama_layanan', 'status_aktif', 'sort_order'],
  Master_Kategori_Keuangan: ['kategori_id', 'jenis', 'nama_kategori', 'status_aktif', 'sort_order'],
};

function setupAllSheets() {
  const spreadsheet = getSpreadsheetForSetup_();

  Object.keys(SHEET_HEADERS).forEach(function (sheetName) {
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
    }

    const headers = SHEET_HEADERS[sheetName];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  });
}

function seedInitialData() {
  const now = nowISOForSetup_();

  appendRowsIfSheetEmpty_('Users', [
    ['usr_owner_01', 'Pemilik Klinik', 'owner@klinikmaju.id', 'pemilik', 'aktif', '', now, now],
    ['usr_admin_01', 'Admin Klinik', 'admin@klinikmaju.id', 'admin_klinik', 'aktif', '', now, now],
    ['usr_cs_01', 'CS Klinik', 'cs@klinikmaju.id', 'cs', 'aktif', '', now, now],
    ['usr_keu_01', 'Staff Keuangan', 'finance@klinikmaju.id', 'keuangan', 'aktif', '', now, now],
    ['usr_medis_01', 'Bidan Jaga', 'medis@klinikmaju.id', 'medis', 'aktif', '', now, now],
  ]);

  appendRowsIfSheetEmpty_('Master_Layanan', [
    ['lay_001', 'ANC', 'Aktif', 1],
    ['lay_002', 'Pemeriksaan Umum', 'Aktif', 2],
    ['lay_003', 'Imunisasi', 'Aktif', 3],
    ['lay_004', 'KB', 'Aktif', 4],
  ]);

  appendRowsIfSheetEmpty_('Master_Kategori_Keuangan', [
    ['katm_001', 'Masuk', 'Pasien Periksa', 'Aktif', 1],
    ['katm_002', 'Masuk', 'Endorsement', 'Aktif', 2],
    ['katm_003', 'Masuk', 'Kerjasama Brand', 'Aktif', 3],
    ['katm_004', 'Masuk', 'Penjualan Obat', 'Aktif', 4],
    ['katm_005', 'Masuk', 'Lain-lain', 'Aktif', 5],
    ['katk_001', 'Keluar', 'Beli Obat / Farmasi', 'Aktif', 1],
    ['katk_002', 'Keluar', 'Alat Medis', 'Aktif', 2],
    ['katk_003', 'Keluar', 'Perbaikan Klinik', 'Aktif', 3],
    ['katk_004', 'Keluar', 'Gaji & Operasional', 'Aktif', 4],
    ['katk_005', 'Keluar', 'Lain-lain', 'Aktif', 5],
  ]);

  appendRowsIfSheetEmpty_('Hero_Content', [
    ['hero_01', 'Solusi Klinik End-to-End', 'Sistem Klinik Modern untuk Operasional Harian', 'Kelola pasien, antrian, pemeriksaan, reminder, keuangan, HRD, dan laporan dalam satu dashboard.', 'Masuk Dashboard', '/login', 'Konsultasi', 'https://wa.me/6281234567890', 'true'],
  ]);

  appendRowsIfSheetEmpty_('Feature_Items', [
    ['ftr_001', 'users', 'Manajemen Pasien', 'Data pasien dan kunjungan tertata rapi.', 1, 'true'],
    ['ftr_002', 'list', 'Antrian Real-time', 'Status antrian mudah dipantau.', 2, 'true'],
    ['ftr_003', 'stethoscope', 'Pemeriksaan & Diagnosa', 'Catat diagnosa, analisa, tindakan, dan kontrol.', 3, 'true'],
  ]);

  appendRowsIfSheetEmpty_('Pricing_Plans', [
    ['prc_001', 'Starter', 'Bulanan', '299000', 'Untuk klinik kecil', 'Antrian, Pasien, Reminder', 'Pilih Starter', 'false', 'true', 1],
    ['prc_002', 'Growth', 'Bulanan', '599000', 'Untuk klinik berkembang', 'Semua Starter + Keuangan + HRD', 'Pilih Growth', 'true', 'true', 2],
    ['prc_003', 'Enterprise', 'Custom', '0', 'Untuk multi cabang', 'Fitur lengkap + support dedicated', 'Hubungi Kami', 'false', 'true', 3],
  ]);
}

function appendRowsIfSheetEmpty_(sheetName, rows) {
  const sheet = getSheetForSetup_(sheetName);
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1 && rows.length > 0) {
    const colCount = SHEET_HEADERS[sheetName].length;
    const normalized = rows.map(function (row) {
      const clone = row.slice(0, colCount);
      while (clone.length < colCount) {
        clone.push('');
      }
      return clone;
    });

    sheet.getRange(2, 1, normalized.length, colCount).setValues(normalized);
  }
}

function getSpreadsheetForSetup_() {
  const hasConfig = typeof GAS_CONFIG !== 'undefined' && GAS_CONFIG && GAS_CONFIG.SPREADSHEET_ID;
  if (hasConfig && String(GAS_CONFIG.SPREADSHEET_ID).indexOf('REPLACE_WITH') === -1) {
    return SpreadsheetApp.openById(GAS_CONFIG.SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getSheetForSetup_(sheetName) {
  const spreadsheet = getSpreadsheetForSetup_();
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  return sheet;
}

function nowISOForSetup_() {
  return new Date().toISOString();
}
