import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
})

export const patientSchema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter'),
  nik: z.string().min(8, 'NIK wajib diisi'),
  hp: z.string().min(8, 'Nomor HP wajib diisi'),
  tanggal_lahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
  jenis_kelamin: z.enum(['L', 'P']),
})

export const queueSchema = z.object({
  pasien_id: z.string().min(1, 'Pasien wajib dipilih'),
  tanggal: z.string().min(1, 'Tanggal wajib diisi'),
  layanan: z.string().min(2, 'Layanan wajib diisi'),
})

export const examSchema = z.object({
  pasien_id: z.string().min(1, 'Pasien wajib dipilih'),
  tanggal: z.string().min(1, 'Tanggal wajib diisi'),
  diagnosa: z.string().min(2, 'Diagnosa wajib diisi'),
  analisa: z.string().min(2, 'Analisa wajib diisi'),
})

export const financeSchema = z.object({
  tanggal: z.string().min(1, 'Tanggal wajib diisi'),
  jenis: z.enum(['Masuk', 'Keluar']),
  kategori: z.string().min(1, 'Kategori wajib diisi'),
  nominal: z.number().min(1, 'Nominal wajib lebih dari 0'),
  keterangan: z.string().min(2, 'Keterangan wajib diisi'),
})
