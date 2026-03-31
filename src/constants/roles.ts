import type { Role } from '../types/domain'

export const ROLES: Role[] = ['pemilik', 'admin_klinik', 'cs', 'keuangan', 'medis']

export const ROLE_LABELS: Record<Role, string> = {
  pemilik: 'Pemilik',
  admin_klinik: 'Admin Klinik',
  cs: 'Customer Service',
  keuangan: 'Keuangan',
  medis: 'Tenaga Medis',
}
