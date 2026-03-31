/**
 * Central configuration for Google Apps Script API.
 */
const GAS_CONFIG = {
  SPREADSHEET_ID: 'REPLACE_WITH_SPREADSHEET_ID',
  LIST_LIMIT_DEFAULT: 200,
  ROLES: ['pemilik', 'admin_klinik', 'cs', 'keuangan', 'medis'],
  SHEETS: {
    USERS: 'Users',
    PATIENTS: 'Pasien',
    QUEUE: 'Antrian',
    EXAMINATIONS: 'Pemeriksaan',
    REMINDERS: 'Reminder',
    FINANCE: 'Keuangan',
    EMPLOYEES: 'Karyawan',
    ATTENDANCE: 'Absensi',
    AUDIT_LOG: 'Audit_Log',
    MASTER_LAYANAN: 'Master_Layanan',
    MASTER_KATEGORI_KEUANGAN: 'Master_Kategori_Keuangan',
    SITE_SETTINGS: 'Site_Settings',
    HERO_CONTENT: 'Hero_Content',
    FEATURE_ITEMS: 'Feature_Items',
    PRICING_PLANS: 'Pricing_Plans',
    FOOTER_CONTENT: 'Footer_Content',
    CONTACT_INFO: 'Contact_Info',
    REPORT_ANC: 'Laporan_ANC',
    REPORT_PARTUS: 'Laporan_Partus',
    REPORT_BIDAN: 'Laporan_Bidan',
    REPORT_DOKTER: 'Laporan_Dokter',
    REPORT_KECANTIKAN: 'Laporan_Kecantikan',
    REPORT_SHK: 'Laporan_SHK',
    REPORT_IMUNISASI: 'Laporan_Imunisasi',
    REPORT_KB: 'Laporan_KB',
  },
}

const REPORT_SHEET_BY_TYPE = {
  anc: GAS_CONFIG.SHEETS.REPORT_ANC,
  partus: GAS_CONFIG.SHEETS.REPORT_PARTUS,
  bidan: GAS_CONFIG.SHEETS.REPORT_BIDAN,
  dokter: GAS_CONFIG.SHEETS.REPORT_DOKTER,
  kecantikan: GAS_CONFIG.SHEETS.REPORT_KECANTIKAN,
  shk: GAS_CONFIG.SHEETS.REPORT_SHK,
  imunisasi: GAS_CONFIG.SHEETS.REPORT_IMUNISASI,
  kb: GAS_CONFIG.SHEETS.REPORT_KB,
}

const CONTENT_SHEET_BY_TYPE = {
  hero: GAS_CONFIG.SHEETS.HERO_CONTENT,
  features: GAS_CONFIG.SHEETS.FEATURE_ITEMS,
  pricing: GAS_CONFIG.SHEETS.PRICING_PLANS,
  site_settings: GAS_CONFIG.SHEETS.SITE_SETTINGS,
  footer: GAS_CONFIG.SHEETS.FOOTER_CONTENT,
  contact: GAS_CONFIG.SHEETS.CONTACT_INFO,
}
