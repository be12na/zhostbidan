import type {
  AccessUser,
  Attendance,
  ContentRecord,
  Examination,
  FinanceTransaction,
  Patient,
  QueueItem,
  Reminder,
  ReportRecord,
  SessionUser,
  Employee,
} from '../../types/domain'
import { createResourceService } from './resource'
import { apiClient } from './client'

export const authService = {
  login: (email: string) => apiClient.post<SessionUser>('auth', 'login', { email }),
}

export const patientsService = createResourceService<
  Patient,
  Pick<Patient, 'nama' | 'nik' | 'tanggal_lahir' | 'jenis_kelamin' | 'hp'>,
  Partial<Patient>
>('patients')

export const queueService = createResourceService<
  QueueItem,
  Pick<QueueItem, 'tanggal' | 'pasien_id' | 'layanan' | 'status'>,
  Pick<QueueItem, 'id_antrian' | 'status' | 'diagnosa_ringkas' | 'analisa_ringkas'>
>('queue')

export const examinationsService = createResourceService<
  Examination,
  Pick<Examination, 'tanggal' | 'pasien_id' | 'antrian_id' | 'tenaga_medis' | 'diagnosa' | 'analisa' | 'tindakan' | 'catatan' | 'tgl_kembali' | 'keperluan_kembali'>,
  Partial<Examination>
>('examinations')

export const remindersService = createResourceService<
  Reminder,
  Pick<Reminder, 'pasien_id' | 'nama' | 'no_wa' | 'jenis' | 'waktu' | 'status' | 'catatan_cs'>,
  Partial<Reminder>
>('reminders')

export const financeService = createResourceService<
  FinanceTransaction,
  Pick<FinanceTransaction, 'tanggal' | 'jenis' | 'kategori' | 'nominal' | 'keterangan' | 'created_by'> &
    Partial<Pick<FinanceTransaction, 'pasien_id' | 'antrian_id'>>,
  Partial<FinanceTransaction>
>('finance')

export const employeesService = createResourceService<
  Employee,
  Pick<Employee, 'nama' | 'posisi' | 'kontak' | 'jadwal' | 'status_aktif'>,
  Partial<Employee>
>('employees')

export const attendanceService = createResourceService<
  Attendance,
  Pick<Attendance, 'tanggal' | 'karyawan_id' | 'status' | 'lembur_jam' | 'catatan' | 'input_by'>,
  Partial<Attendance>
>('attendance')

export const usersService = createResourceService<
  AccessUser,
  Pick<AccessUser, 'nama' | 'email' | 'role' | 'status'>,
  Partial<AccessUser>
>('users')

export const reportsService = {
  list: (type: string, filters?: Record<string, string | number | undefined>) =>
    apiClient.get<ReportRecord[]>('reports', 'list', { type, ...filters }),
  create: (type: string, payload: Record<string, string | number | boolean | undefined>) =>
    apiClient.post<ReportRecord>('reports', 'create', { type, ...payload }),
  update: (type: string, payload: Record<string, string | number | boolean | undefined>) =>
    apiClient.post<ReportRecord>('reports', 'update', { type, ...payload }),
}

export const contentService = {
  list: (type: string) => apiClient.get<ContentRecord[]>('content', 'list', { type }),
  create: (type: string, payload: Record<string, string | number | boolean | undefined>) =>
    apiClient.post<ContentRecord>('content', 'create', { type, ...payload }),
  update: (type: string, payload: Record<string, string | number | boolean | undefined>) =>
    apiClient.post<ContentRecord>('content', 'update', { type, ...payload }),
}
