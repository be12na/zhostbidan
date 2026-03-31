export type ReportType =
  | 'anc'
  | 'partus'
  | 'bidan'
  | 'dokter'
  | 'kecantikan'
  | 'shk'
  | 'imunisasi'
  | 'kb'

export interface ReportField {
  key: string
  label: string
}

export const REPORT_TYPE_OPTIONS: { value: ReportType; label: string }[] = [
  { value: 'anc', label: 'ANC' },
  { value: 'partus', label: 'Partus' },
  { value: 'bidan', label: 'Bidan' },
  { value: 'dokter', label: 'Dokter' },
  { value: 'kecantikan', label: 'Kecantikan' },
  { value: 'shk', label: 'SHK' },
  { value: 'imunisasi', label: 'Imunisasi' },
  { value: 'kb', label: 'KB' },
]

export const REPORT_FIELDS: Record<ReportType, ReportField[]> = {
  anc: [
    { key: 'tanggal', label: 'Tanggal' },
    { key: 'pasien', label: 'Pasien' },
    { key: 'hpht', label: 'HPHT' },
    { key: 'tp_uk', label: 'TP/UK' },
    { key: 'diagnosa', label: 'Diagnosa' },
    { key: 'kspr', label: 'KSPR' },
    { key: 'keterangan', label: 'Keterangan' },
  ],
  partus: [
    { key: 'tanggal', label: 'Tanggal' },
    { key: 'pasien', label: 'Pasien' },
    { key: 'gpa', label: 'GPA' },
    { key: 'uk', label: 'Usia Kehamilan' },
    { key: 'bbl', label: 'BBL' },
    { key: 'keterangan', label: 'Keterangan' },
  ],
  bidan: [
    { key: 'tanggal', label: 'Tanggal' },
    { key: 'pasien', label: 'Pasien' },
    { key: 'diagnosa', label: 'Diagnosa' },
    { key: 'keterangan', label: 'Keterangan' },
  ],
  dokter: [
    { key: 'tanggal', label: 'Tanggal' },
    { key: 'pasien', label: 'Pasien' },
    { key: 'diagnosa', label: 'Diagnosa' },
    { key: 'analisa', label: 'Analisa' },
    { key: 'keterangan', label: 'Keterangan' },
  ],
  kecantikan: [
    { key: 'tanggal', label: 'Tanggal' },
    { key: 'pasien', label: 'Pasien' },
    { key: 'tindakan', label: 'Tindakan' },
    { key: 'catatan', label: 'Catatan' },
  ],
  shk: [
    { key: 'tanggal', label: 'Tanggal' },
    { key: 'pasien', label: 'Pasien' },
    { key: 'nama_bayi', label: 'Nama Bayi' },
    { key: 'faskes_lahir', label: 'Faskes Lahir' },
    { key: 'keterangan', label: 'Keterangan' },
  ],
  imunisasi: [
    { key: 'tanggal_input', label: 'Tanggal Input' },
    { key: 'nama_bayi', label: 'Nama Bayi' },
    { key: 'nama_ibu', label: 'Nama Ibu' },
    { key: 'v_hb0', label: 'HB0' },
    { key: 'v_bcg', label: 'BCG' },
    { key: 'v_campak', label: 'Campak' },
  ],
  kb: [
    { key: 'tanggal', label: 'Tanggal' },
    { key: 'pasien', label: 'Pasien' },
    { key: 'metode', label: 'Metode' },
    { key: 'jml_anak', label: 'Jumlah Anak' },
    { key: 'keterangan', label: 'Keterangan' },
  ],
}
