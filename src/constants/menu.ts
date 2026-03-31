import type { Role } from '../types/domain'

export interface MenuItem {
  key: string
  label: string
  path: string
  roles: Role[]
}

export const MENU_ITEMS: MenuItem[] = [
  { key: 'overview', label: 'Dashboard', path: '/app', roles: ['pemilik', 'admin_klinik', 'cs', 'keuangan', 'medis'] },
  { key: 'queue', label: 'Antrian', path: '/app/queue', roles: ['pemilik', 'admin_klinik', 'cs', 'medis'] },
  { key: 'patients', label: 'Pasien', path: '/app/patients', roles: ['pemilik', 'admin_klinik', 'cs', 'medis'] },
  { key: 'examinations', label: 'Pemeriksaan', path: '/app/examinations', roles: ['pemilik', 'medis'] },
  { key: 'reminders', label: 'Reminder', path: '/app/reminders', roles: ['pemilik', 'admin_klinik', 'cs'] },
  { key: 'finance', label: 'Keuangan', path: '/app/finance', roles: ['pemilik', 'keuangan'] },
  { key: 'hrd', label: 'HRD', path: '/app/hrd', roles: ['pemilik', 'admin_klinik'] },
  { key: 'reports', label: 'Laporan', path: '/app/reports', roles: ['pemilik', 'admin_klinik', 'medis'] },
  { key: 'content', label: 'Konten Website', path: '/app/content', roles: ['pemilik', 'admin_klinik'] },
  { key: 'access', label: 'Hak Akses', path: '/app/access', roles: ['pemilik'] },
]
