export type Role = 'pemilik' | 'admin_klinik' | 'cs' | 'keuangan' | 'medis'

export interface SessionUser {
  user_id: string
  nama: string
  email: string
  role: Role
  status: 'aktif' | 'nonaktif'
  last_login?: string
}

export interface Patient {
  pasien_id: string
  no_rm: string
  nama: string
  nik: string
  tanggal_lahir: string
  umur: number
  jenis_kelamin: 'L' | 'P'
  alamat: string
  hp: string
  no_bpjs: string
  status_bpjs: 'Aktif' | 'Tidak Aktif'
  satu_sehat_flag: 'Ya' | 'Tidak'
  last_visit: string
  created_at: string
  updated_at: string
}

export interface QueueItem {
  id_antrian: string
  tanggal: string
  pasien_id: string
  nama_pasien: string
  layanan: string
  status: 'Menunggu' | 'Diperiksa' | 'Selesai' | 'Batal'
  diagnosa_ringkas: string
  analisa_ringkas: string
  created_by: string
  updated_at: string
}

export interface Examination {
  pemeriksaan_id: string
  tanggal: string
  pasien_id: string
  antrian_id: string
  tenaga_medis: string
  diagnosa: string
  analisa: string
  tindakan: string
  catatan: string
  tgl_kembali: string
  keperluan_kembali: string
  created_at: string
}

export interface Reminder {
  reminder_id: string
  pasien_id: string
  nama: string
  no_wa: string
  jenis: string
  waktu: string
  status: 'Belum Dihubungi' | 'Sudah Dihubungi' | 'Follow Up Ulang'
  catatan_cs: string
  created_at: string
  updated_at: string
}

export interface FinanceTransaction {
  transaksi_id: string
  tanggal: string
  jenis: 'Masuk' | 'Keluar'
  kategori: string
  nominal: number
  keterangan: string
  pasien_id?: string
  antrian_id?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface Employee {
  karyawan_id: string
  nama: string
  posisi: string
  kontak: string
  jadwal: string
  status_aktif: 'Aktif' | 'Nonaktif'
  created_at: string
  updated_at: string
}

export interface Attendance {
  absensi_id: string
  tanggal: string
  karyawan_id: string
  status: 'Hadir' | 'Izin' | 'Cuti' | 'Libur' | 'Lembur'
  lembur_jam: number
  catatan: string
  input_by: string
  created_at: string
}

export interface AccessUser extends SessionUser {
  created_at: string
  updated_at: string
}

export interface ReportRecord {
  id: string
  type: string
  tanggal: string
  pasien: string
  nama_bayi?: string
  keterangan: string
  created_at: string
  [key: string]: string | number | undefined
}

export interface ContentRecord {
  id: string
  type: 'hero' | 'features' | 'pricing' | 'site_settings' | 'footer' | 'contact'
  title: string
  subtitle: string
  description: string
  cta_text: string
  cta_link: string
  is_active: 'true' | 'false'
  sort_order: number
}

export interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
  meta?: Record<string, string | number | boolean>
}
