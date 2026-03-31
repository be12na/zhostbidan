import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const outDir = resolve(process.cwd(), 'docs', 'demo-dummy-csv')

const toDate = (date) => date.toISOString().slice(0, 10)
const toDateTime = (date) => `${toDate(date)}T${date.toISOString().slice(11, 19)}Z`

const baseNow = new Date('2026-04-01T08:00:00Z')

const users = [
  ['usr_0001', 'Nabila Rahmawati', 'owner@zhostbidan.demo', 'pemilik', 'aktif', '2026-03-31T08:10:00Z', '2026-01-01T08:00:00Z', '2026-03-31T08:10:00Z'],
  ['usr_0002', 'Dian Puspitasari', 'admin@zhostbidan.demo', 'admin_klinik', 'aktif', '2026-03-31T08:30:00Z', '2026-01-02T08:00:00Z', '2026-03-31T08:30:00Z'],
  ['usr_0003', 'Salsa Maulida', 'cs1@zhostbidan.demo', 'cs', 'aktif', '2026-03-31T07:55:00Z', '2026-01-05T08:00:00Z', '2026-03-31T07:55:00Z'],
  ['usr_0004', 'Rani Lestari', 'cs2@zhostbidan.demo', 'cs', 'aktif', '2026-03-30T15:11:00Z', '2026-01-11T08:00:00Z', '2026-03-30T15:11:00Z'],
  ['usr_0005', 'Fajar Nugroho', 'finance1@zhostbidan.demo', 'keuangan', 'aktif', '2026-03-31T09:20:00Z', '2026-01-03T08:00:00Z', '2026-03-31T09:20:00Z'],
  ['usr_0006', 'Fina Azzahra', 'finance2@zhostbidan.demo', 'keuangan', 'aktif', '2026-03-29T10:05:00Z', '2026-01-13T08:00:00Z', '2026-03-29T10:05:00Z'],
  ['usr_0007', 'dr. Andi Pratama', 'medis1@zhostbidan.demo', 'medis', 'aktif', '2026-03-31T12:02:00Z', '2026-01-04T08:00:00Z', '2026-03-31T12:02:00Z'],
  ['usr_0008', 'Bdn. Ayu Kurniasih', 'medis2@zhostbidan.demo', 'medis', 'aktif', '2026-03-31T11:18:00Z', '2026-01-06T08:00:00Z', '2026-03-31T11:18:00Z'],
  ['usr_0009', 'Nur Komariah', 'hrd@zhostbidan.demo', 'admin_klinik', 'aktif', '2026-03-28T16:43:00Z', '2026-01-08T08:00:00Z', '2026-03-28T16:43:00Z'],
  ['usr_0010', 'Akun Lama Nonaktif', 'old.staff@zhostbidan.demo', 'cs', 'nonaktif', '2026-02-20T10:00:00Z', '2025-10-01T08:00:00Z', '2026-02-20T10:00:00Z'],
]

const patientNames = [
  'Aisyah Putri Ramadhani',
  'Nadya Maharani',
  'Rina Kartika Sari',
  'Maya Oktaviani',
  'Tania Nurhaliza',
  'Siti Nur Aisyah',
  'Laila Fitriani',
  'Dewi Kusumaningrum',
  'Anisa Mardhiyah',
  'Rahmawati Nuraini',
  'Putri Cahyani',
  'Wulan Safitri',
  'Shabrina Aulia',
  'Nia Agustina',
  'Eka Yuliana',
  'Farah Nabila',
  'Icha Amelia',
  'Rizka Maulana',
  'Nabila Salsabila',
  'Intan Permata',
  'Siska Melinda',
  'Ratu Maharani',
  'Arum Puspita',
  'Niken Larasati',
]

const areas = ['Bandung', 'Cimahi', 'Soreang', 'Rancaekek', 'Majalaya', 'Lembang', 'Cicalengka', 'Baleendah']

const patients = patientNames.map((name, idx) => {
  const n = idx + 1
  const year = 1988 + (idx % 14)
  const month = String((idx % 12) + 1).padStart(2, '0')
  const day = String(((idx * 2) % 27) + 1).padStart(2, '0')
  const dob = `${year}-${month}-${day}`
  const age = 2026 - year
  const gender = idx % 5 === 0 ? 'L' : 'P'
  const bpjsActive = idx % 3 !== 0
  const created = new Date(`2026-02-${String((idx % 20) + 1).padStart(2, '0')}T08:00:00Z`)
  const updated = new Date(`2026-03-${String((idx % 28) + 1).padStart(2, '0')}T09:00:00Z`)
  return [
    `pas_${String(n).padStart(4, '0')}`,
    `RM-202603-${String(n).padStart(4, '0')}`,
    name,
    `3173${String(120000000000 + n).padStart(12, '0')}`,
    dob,
    age,
    gender,
    `${areas[idx % areas.length]} Blok ${String.fromCharCode(65 + (idx % 8))} No.${(idx % 19) + 2}`,
    `08${String(1100000000 + idx * 731).slice(0, 10)}`,
    bpjsActive ? `000${String(9300000000 + n)}` : '',
    bpjsActive ? 'Aktif' : 'Tidak Aktif',
    idx % 4 === 0 ? 'Ya' : 'Tidak',
    `2026-03-${String((idx % 29) + 1).padStart(2, '0')}`,
    toDateTime(created),
    toDateTime(updated),
  ]
})

const layananList = ['ANC', 'Pemeriksaan Umum', 'Imunisasi', 'KB', 'USG', 'Konsultasi Laktasi']
const statusQueue = ['Menunggu', 'Diperiksa', 'Selesai', 'Batal']

const queueRows = Array.from({ length: 42 }).map((_, idx) => {
  const n = idx + 1
  const patient = patients[idx % patients.length]
  const layanan = layananList[idx % layananList.length]
  const status = statusQueue[idx % statusQueue.length]
  const d = `2026-03-${String((idx % 31) + 1).padStart(2, '0')}`
  const creator = idx % 2 === 0 ? 'cs1@zhostbidan.demo' : 'cs2@zhostbidan.demo'
  const diag = status === 'Selesai' || status === 'Diperiksa' ? ['ISPA ringan', 'Kontrol ANC', 'Demam viral', 'Konseling KB', 'Check up rutin'][idx % 5] : ''
  const analisa = status === 'Selesai' || status === 'Diperiksa' ? ['Perlu observasi', 'Lanjut vitamin', 'Istirahat cukup', 'Jadwal kontrol', 'Kondisi stabil'][idx % 5] : ''
  return [
    `antr_${String(n).padStart(4, '0')}`,
    d,
    patient[0],
    patient[2],
    layanan,
    status,
    diag,
    analisa,
    creator,
    `${d}T${String((8 + (idx % 9))).padStart(2, '0')}:15:00Z`,
  ]
})

const completedOrChecked = queueRows.filter((r) => r[5] === 'Selesai' || r[5] === 'Diperiksa').slice(0, 24)

const examinations = completedOrChecked.map((q, idx) => {
  const n = idx + 1
  const kontrol = idx % 3 === 0 ? `2026-04-${String((idx % 20) + 3).padStart(2, '0')}` : ''
  const need = kontrol ? ['Kontrol ANC', 'Evaluasi obat', 'Review lab'][idx % 3] : ''
  return [
    `per_${String(n).padStart(4, '0')}`,
    q[1],
    q[2],
    q[0],
    idx % 2 === 0 ? 'dok_andi' : 'bdn_ayu',
    idx % 2 === 0 ? 'dr. Andi Pratama' : 'Bdn. Ayu Kurniasih',
    ['ISPA', 'Gastritis', 'Anemia ringan', 'Kontrol kehamilan', 'Demam tifoid observasi'][idx % 5],
    ['Tanda vital stabil', 'Perlu hidrasi', 'Perlu suplemen Fe', 'Janin aktif', 'Perlu observasi 3 hari'][idx % 5],
    ['Nebulizer', 'PPI oral', 'Tablet Fe', 'USG ANC', 'Antipiretik'][idx % 5],
    ['Pulang dengan edukasi', 'Kontrol 7 hari', 'Pantau asupan', 'Lanjut kontrol rutin', 'Kembali bila demam tinggi'][idx % 5],
    kontrol,
    need,
    `${q[1]}T${String((10 + (idx % 6))).padStart(2, '0')}:40:00Z`,
  ]
})

const reminders = examinations
  .filter((e) => e[10])
  .map((e, idx) => {
    const patient = patients.find((p) => p[0] === e[2])
    return [
      `rem_${String(idx + 1).padStart(4, '0')}`,
      e[2],
      patient ? patient[2] : 'Pasien',
      patient ? patient[8] : '081200000000',
      e[11],
      e[10],
      ['Belum Dihubungi', 'Sudah Dihubungi', 'Follow Up Ulang'][idx % 3],
      ['Auto reminder dari pemeriksaan', 'Pasien diminta konfirmasi jadwal', 'Perlu follow up ulang minggu depan'][idx % 3],
      `${e[1]}T15:00:00Z`,
      `${e[1]}T16:00:00Z`,
    ]
  })

const financeIncomeByService = {
  ANC: 275000,
  'Pemeriksaan Umum': 180000,
  Imunisasi: 220000,
  KB: 165000,
  USG: 320000,
  'Konsultasi Laktasi': 210000,
}

const finance = []
let trxIndex = 1

for (const q of queueRows) {
  if (q[5] === 'Batal') continue
  finance.push([
    `trx_${String(trxIndex++).padStart(4, '0')}`,
    q[1],
    'Masuk',
    'Pasien Periksa',
    financeIncomeByService[q[4]] || 175000,
    `Pendapatan layanan ${q[4]}`,
    q[2],
    q[0],
    'finance1@zhostbidan.demo',
    `${q[1]}T18:00:00Z`,
    `${q[1]}T18:00:00Z`,
  ])
}

const expenseCats = ['Beli Obat / Farmasi', 'Alat Medis', 'Perbaikan Klinik', 'Gaji & Operasional', 'Lain-lain']
const expenseNotes = ['Restock obat batuk', 'Pembelian sarung tangan', 'Service AC ruang periksa', 'Honor tenaga medis', 'Biaya internet dan listrik']

for (let i = 0; i < 18; i += 1) {
  const d = `2026-03-${String((i % 28) + 1).padStart(2, '0')}`
  finance.push([
    `trx_${String(trxIndex++).padStart(4, '0')}`,
    d,
    'Keluar',
    expenseCats[i % expenseCats.length],
    90000 + (i % 6) * 45000,
    expenseNotes[i % expenseNotes.length],
    '',
    '',
    'finance2@zhostbidan.demo',
    `${d}T19:00:00Z`,
    `${d}T19:00:00Z`,
  ])
}

const employees = [
  ['kar_001', 'Bdn. Ayu Kurniasih', 'Bidan', '081230000001', 'Shift Pagi', 'Aktif', '2026-01-01T08:00:00Z', '2026-03-31T09:00:00Z'],
  ['kar_002', 'dr. Andi Pratama', 'Dokter Umum', '081230000002', 'Shift Pagi', 'Aktif', '2026-01-01T08:00:00Z', '2026-03-31T09:00:00Z'],
  ['kar_003', 'Salsa Maulida', 'Customer Service', '081230000003', 'Shift Siang', 'Aktif', '2026-01-05T08:00:00Z', '2026-03-30T14:00:00Z'],
  ['kar_004', 'Rani Lestari', 'Customer Service', '081230000004', 'Shift Siang', 'Aktif', '2026-01-11T08:00:00Z', '2026-03-30T14:00:00Z'],
  ['kar_005', 'Fajar Nugroho', 'Staff Keuangan', '081230000005', 'Shift Pagi', 'Aktif', '2026-01-03T08:00:00Z', '2026-03-31T12:00:00Z'],
  ['kar_006', 'Fina Azzahra', 'Staff Keuangan', '081230000006', 'Shift Pagi', 'Aktif', '2026-01-13T08:00:00Z', '2026-03-31T12:00:00Z'],
  ['kar_007', 'Nur Komariah', 'Admin Klinik', '081230000007', 'Shift Pagi', 'Aktif', '2026-01-08T08:00:00Z', '2026-03-29T10:30:00Z'],
  ['kar_008', 'Widi Astuti', 'Perawat', '081230000008', 'Shift Malam', 'Aktif', '2026-02-01T08:00:00Z', '2026-03-28T10:30:00Z'],
  ['kar_009', 'Rizal Hidayat', 'Farmasi', '081230000009', 'Shift Siang', 'Aktif', '2026-02-12T08:00:00Z', '2026-03-28T10:30:00Z'],
  ['kar_010', 'Evi Damayanti', 'Front Office', '081230000010', 'Shift Pagi', 'Nonaktif', '2026-02-18T08:00:00Z', '2026-03-20T10:30:00Z'],
]

const attendanceStatuses = ['Hadir', 'Hadir', 'Hadir', 'Izin', 'Cuti', 'Lembur', 'Libur']
const attendance = []
let absIdx = 1
for (let day = 1; day <= 12; day += 1) {
  for (const emp of employees.filter((e) => e[5] === 'Aktif')) {
    if ((day + Number(emp[0].slice(-1))) % 4 === 0) continue
    const status = attendanceStatuses[(day + Number(emp[0].slice(-1))) % attendanceStatuses.length]
    attendance.push([
      `abs_${String(absIdx++).padStart(4, '0')}`,
      `2026-03-${String(day).padStart(2, '0')}`,
      emp[0],
      status,
      status === 'Lembur' ? 2 : 0,
      status === 'Izin' ? 'Izin keluarga' : status === 'Cuti' ? 'Cuti terjadwal' : '',
      'hrd@zhostbidan.demo',
      `2026-03-${String(day).padStart(2, '0')}T20:00:00Z`,
    ])
  }
}

const laporanANC = [
  ['anc_0001', '2026-03-05', 'Aisyah Putri Ramadhani', '2025-08-01', 'TP 2026-05-08 UK 30', 'Kehamilan normal', 'Risiko rendah', '58/158', '24', '11.8', 'O', 'Negatif', 'Non Reaktif', 'Negatif', 'Non Reaktif', 'Ada', 'Lanjut kontrol 2 minggu', '2026-03-05T11:00:00Z'],
  ['anc_0002', '2026-03-12', 'Nadya Maharani', '2025-08-10', 'TP 2026-05-17 UK 29', 'Anemia ringan', 'Risiko sedang', '55/156', '23', '10.6', 'A', 'Negatif', 'Non Reaktif', 'Negatif', 'Non Reaktif', 'Ada', 'Tambahan Fe harian', '2026-03-12T10:45:00Z'],
  ['anc_0003', '2026-03-18', 'Rina Kartika Sari', '2025-08-20', 'TP 2026-05-27 UK 28', 'Mual trimester akhir', 'Risiko rendah', '60/160', '25', '12.1', 'B', 'Negatif', 'Non Reaktif', 'Negatif', 'Non Reaktif', 'Ada', 'Edukasi nutrisi', '2026-03-18T09:30:00Z'],
]

const laporanPartus = [
  ['prt_0001', '2026-03-08', 'Tania Nurhaliza', 'G2P1A0', '39', '3200', '49', 'P', 'Baik', 'Sudah', 'Sudah', 'Ya', 'Sudah', 'IUD', 'Ibu dan bayi stabil', '2026-03-08T14:20:00Z'],
  ['prt_0002', '2026-03-21', 'Siti Nur Aisyah', 'G1P0A0', '38', '3000', '48', 'L', 'Baik', 'Sudah', 'Sudah', 'Ya', 'Sudah', 'Suntik', 'Observasi 24 jam', '2026-03-21T16:10:00Z'],
]

const laporanBidan = [
  ['bdn_0001', '2026-03-06', 'Laila Fitriani', 'Kontrol nifas', 'Luka baik', 'Edukasi laktasi', 'Kontrol 1 minggu', '2026-03-06T13:00:00Z'],
  ['bdn_0002', '2026-03-19', 'Dewi Kusumaningrum', 'Mastitis ringan', 'Perlu kompres hangat', 'Konseling menyusui', 'Pantau 3 hari', '2026-03-19T15:00:00Z'],
]

const laporanDokter = [
  ['dok_0001', '2026-03-04', 'Anisa Mardhiyah', 'ISPA', 'Tanpa komplikasi', 'Nebulizer', 'Paracetamol 500mg', 'Kontrol bila batuk > 3 hari', '2026-03-04T11:40:00Z'],
  ['dok_0002', '2026-03-10', 'Rahmawati Nuraini', 'Gastritis', 'Iritasi lambung', 'Terapi oral', 'Omeprazole', 'Hindari makanan pedas', '2026-03-10T09:55:00Z'],
  ['dok_0003', '2026-03-28', 'Putri Cahyani', 'Anemia ringan', 'Hb rendah', 'Terapi suplemen', 'Tablet Fe', 'Kontrol 14 hari', '2026-03-28T10:30:00Z'],
]

const laporanKecantikan = [
  ['kec_0001', '2026-03-07', 'Wulan Safitri', 'Facial brightening', 'Tidak ada iritasi', '2026-03-07T17:00:00Z'],
  ['kec_0002', '2026-03-14', 'Shabrina Aulia', 'Chemical peeling ringan', 'Kemerahan ringan normal', '2026-03-14T17:30:00Z'],
  ['kec_0003', '2026-03-29', 'Nia Agustina', 'Acne treatment', 'Perlu kontrol 2 minggu', '2026-03-29T16:10:00Z'],
]

const laporanSHK = [
  ['shk_0001', '2026-03-09', 'Tania Nurhaliza', 'Alya Zahra', '2026-03-08', 'Klinik Zhost Bidan', 'P', 'Tidak', '3200', '49', '39', 'Tidak', 'Tidak', 'Tidak', 'Klinik Zhost Bidan', '2026-03-09', 'Tumit', 'Tidak', '', 'Sampel terkirim', '2026-03-09T13:10:00Z'],
  ['shk_0002', '2026-03-22', 'Siti Nur Aisyah', 'Arkan Zidan', '2026-03-21', 'Klinik Zhost Bidan', 'L', 'Tidak', '3000', '48', '38', 'Tidak', 'Tidak', 'Tidak', 'Klinik Zhost Bidan', '2026-03-22', 'Tumit', 'Tidak', '', 'Menunggu hasil lab', '2026-03-22T12:00:00Z'],
]

const laporanImunisasi = [
  ['imu_0001', '2026-03-11', 'RM-202603-0001', 'Alya Zahra', '3273010000000001', 'P', '2026-03-08', 'Tania Nurhaliza', '3273010000000101', '081255551001', 'Bandung', '2026-03-08', '2026-03-11', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2026-03-11T10:00:00Z'],
  ['imu_0002', '2026-03-25', 'RM-202603-0002', 'Arkan Zidan', '3273010000000002', 'L', '2026-03-21', 'Siti Nur Aisyah', '3273010000000102', '081255551002', 'Cimahi', '2026-03-21', '2026-03-25', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2026-03-25T10:00:00Z'],
]

const laporanKB = [
  ['kb_0001', '2026-03-03', 'Maya Oktaviani', 'IUD', '2', '5', 'Tidak', '24', 'Tidak', 'Tidak', 'Kontrol 1 bulan', '2026-03-03T09:20:00Z'],
  ['kb_0002', '2026-03-17', 'Farah Nabila', 'Suntik 3 Bulan', '1', '2', 'Tidak', '23', 'Tidak', 'Tidak', 'Edukasi efek samping', '2026-03-17T15:40:00Z'],
  ['kb_0003', '2026-03-27', 'Intan Permata', 'Implant', '3', '7', 'Tidak', '25', 'Tidak', 'Tidak', 'Kontrol 6 bulan', '2026-03-27T11:12:00Z'],
]

const siteSettings = [
  ['site_title', 'ZhostBidan - Sistem Klinik Modern'],
  ['seo_description', 'Platform operasional klinik untuk antrian pasien rekam medis keuangan HRD dan laporan.'],
  ['brand_primary_color', '#0d9488'],
  ['brand_secondary_color', '#0f172a'],
  ['cta_whatsapp', 'https://wa.me/6281234567890'],
  ['contact_email', 'halo@zhostbidan.demo'],
]

const heroContent = [
  ['hero_01', 'Sistem Klinik End-to-End', 'Kelola Operasional Klinik Tanpa Ribet', 'Antrian pasien pemeriksaan reminder keuangan HRD dan laporan dalam satu dashboard.', 'Coba Dashboard', '/login', 'Hubungi Sales', 'https://wa.me/6281234567890', 'true'],
]

const featureItems = [
  ['fit_001', 'users', 'Data Pasien Terpusat', 'Riwayat pasien tersimpan rapi dan mudah dicari.', 1, 'true'],
  ['fit_002', 'list-checks', 'Antrian Real-time', 'Pantau status Menunggu Diperiksa Selesai secara langsung.', 2, 'true'],
  ['fit_003', 'stethoscope', 'Pemeriksaan Terdokumentasi', 'Diagnosa analisa tindakan dan resep tersimpan konsisten.', 3, 'true'],
  ['fit_004', 'bell-ring', 'Reminder Follow Up', 'Jadwal kontrol pasien otomatis masuk ke daftar follow up.', 4, 'true'],
  ['fit_005', 'wallet', 'Keuangan Klinik', 'Pemasukan dan pengeluaran harian mudah dipantau.', 5, 'true'],
  ['fit_006', 'file-text', 'Laporan Siap Export', 'Laporan layanan klinik siap untuk audit dan presentasi.', 6, 'true'],
]

const pricingPlans = [
  ['prc_001', 'Starter', 'Bulanan', '299000', 'Untuk klinik baru berkembang', 'Antrian;Pasien;Reminder', 'Pilih Starter', 'false', 'true', 1],
  ['prc_002', 'Growth', 'Bulanan', '599000', 'Untuk klinik dengan tim operasional aktif', 'Semua Starter;Keuangan;HRD;Laporan', 'Pilih Growth', 'true', 'true', 2],
  ['prc_003', 'Enterprise', 'Tahunan', '0', 'Untuk multi cabang', 'Semua fitur;Support prioritas;Kustom integrasi', 'Konsultasi Sekarang', 'false', 'true', 3],
]

const auditLog = [
  ['log_0001', 'login', 'auth', 'owner@zhostbidan.demo', 'User login from web dashboard', '2026-03-31T08:10:00Z'],
  ['log_0002', 'create', 'patients', 'cs1@zhostbidan.demo', 'Create patient pas_0007', '2026-03-07T09:20:00Z'],
  ['log_0003', 'create', 'queue', 'cs2@zhostbidan.demo', 'Create queue antr_0012', '2026-03-12T08:15:00Z'],
  ['log_0004', 'update', 'queue', 'medis1@zhostbidan.demo', 'Update queue status to Selesai', '2026-03-12T10:15:00Z'],
  ['log_0005', 'create', 'examinations', 'medis2@zhostbidan.demo', 'Create examination per_0006', '2026-03-14T11:30:00Z'],
  ['log_0006', 'create', 'reminders', 'system', 'Auto reminder from examination per_0006', '2026-03-14T11:35:00Z'],
  ['log_0007', 'create', 'finance', 'finance1@zhostbidan.demo', 'Create trx_0021', '2026-03-21T18:00:00Z'],
  ['log_0008', 'update', 'users', 'owner@zhostbidan.demo', 'Set user usr_0010 to nonaktif', '2026-03-22T09:00:00Z'],
  ['log_0009', 'create', 'attendance', 'hrd@zhostbidan.demo', 'Input attendance abs_0039', '2026-03-11T20:00:00Z'],
  ['log_0010', 'export', 'reports', 'admin@zhostbidan.demo', 'Export laporan ANC CSV', '2026-03-30T16:10:00Z'],
]

const masterLayanan = [
  ['lay_001', 'ANC', 'Aktif', 1],
  ['lay_002', 'Pemeriksaan Umum', 'Aktif', 2],
  ['lay_003', 'Imunisasi', 'Aktif', 3],
  ['lay_004', 'KB', 'Aktif', 4],
  ['lay_005', 'USG', 'Aktif', 5],
  ['lay_006', 'Konsultasi Laktasi', 'Aktif', 6],
  ['lay_007', 'Kontrol Nifas', 'Aktif', 7],
  ['lay_008', 'Perawatan Luka', 'Aktif', 8],
]

const masterKategori = [
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
]

const sheets = {
  Users: {
    headers: ['user_id', 'nama', 'email', 'role', 'status', 'last_login', 'created_at', 'updated_at'],
    rows: users,
  },
  Pasien: {
    headers: ['pasien_id', 'no_rm', 'nama', 'nik', 'tanggal_lahir', 'umur', 'jenis_kelamin', 'alamat', 'hp', 'no_bpjs', 'status_bpjs', 'satu_sehat_flag', 'last_visit', 'created_at', 'updated_at'],
    rows: patients,
  },
  Antrian: {
    headers: ['id_antrian', 'tanggal', 'pasien_id', 'nama_pasien', 'layanan', 'status', 'diagnosa_ringkas', 'analisa_ringkas', 'created_by', 'updated_at'],
    rows: queueRows,
  },
  Pemeriksaan: {
    headers: ['pemeriksaan_id', 'tanggal', 'pasien_id', 'antrian_id', 'dokter_id', 'tenaga_medis', 'diagnosa', 'analisa', 'tindakan', 'catatan', 'tgl_kembali', 'keperluan_kembali', 'created_at'],
    rows: examinations,
  },
  Reminder: {
    headers: ['reminder_id', 'pasien_id', 'nama', 'no_wa', 'jenis', 'waktu', 'status', 'catatan_cs', 'created_at', 'updated_at'],
    rows: reminders,
  },
  Keuangan: {
    headers: ['transaksi_id', 'tanggal', 'jenis', 'kategori', 'nominal', 'keterangan', 'pasien_id', 'antrian_id', 'created_by', 'created_at', 'updated_at'],
    rows: finance,
  },
  Karyawan: {
    headers: ['karyawan_id', 'nama', 'posisi', 'kontak', 'jadwal', 'status_aktif', 'created_at', 'updated_at'],
    rows: employees,
  },
  Absensi: {
    headers: ['absensi_id', 'tanggal', 'karyawan_id', 'status', 'lembur_jam', 'catatan', 'input_by', 'created_at'],
    rows: attendance,
  },
  Laporan_ANC: {
    headers: ['id', 'tanggal', 'pasien', 'hpht', 'tp_uk', 'diagnosa', 'kspr', 'bb_tb', 'lila', 'hb', 'gol_darah', 'albumin', 'hiv', 'hepatitis_b', 'sifilis', 'buku_kia', 'keterangan', 'created_at'],
    rows: laporanANC,
  },
  Laporan_Partus: {
    headers: ['id', 'tanggal', 'pasien', 'gpa', 'uk', 'bbl', 'pbl', 'jk_bayi', 'ku_ibu', 'vitamin_k', 'hb0', 'imd', 'vitamin_a', 'kb_pasca_salin', 'keterangan', 'created_at'],
    rows: laporanPartus,
  },
  Laporan_Bidan: {
    headers: ['id', 'tanggal', 'pasien', 'diagnosa', 'analisa', 'tindakan', 'catatan', 'created_at'],
    rows: laporanBidan,
  },
  Laporan_Dokter: {
    headers: ['id', 'tanggal', 'pasien', 'diagnosa', 'analisa', 'tindakan', 'resep', 'catatan', 'created_at'],
    rows: laporanDokter,
  },
  Laporan_Kecantikan: {
    headers: ['id', 'tanggal', 'pasien', 'tindakan', 'catatan', 'created_at'],
    rows: laporanKecantikan,
  },
  Laporan_SHK: {
    headers: ['id', 'tanggal', 'pasien', 'nama_bayi', 'tgl_lahir_bayi', 'faskes_lahir', 'jenis_kelamin', 'kembar', 'bb_bayi', 'pb_bayi', 'umur_kehamilan', 'kelainan_bawaan', 'pengobatan_bayi', 'obat_tiroid_ibu', 'faskes_sampel', 'tgl_sampel', 'lokasi_darah', 'transfusi', 'tgl_transfusi', 'keterangan', 'created_at'],
    rows: laporanSHK,
  },
  Laporan_Imunisasi: {
    headers: ['id', 'tanggal_input', 'no_rm_bayi', 'nama_bayi', 'nik_bayi', 'jk_bayi', 'tgl_lahir_bayi', 'nama_ibu', 'nik_ibu', 'hp_ibu', 'alamat_ibu', 'v_hb0', 'v_bcg', 'v_polio1', 'v_dpt1', 'v_pcv1', 'v_polio2', 'v_dpt2', 'v_pcv2', 'v_polio3', 'v_dpt3', 'v_polio4', 'v_ipv', 'v_campak', 'v_je', 'v_pcv3', 'v_dpt_baduta', 'v_campak_baduta', 'v_ipv2', 'v_ipv3', 'v_pcv4', 'v_ipv4', 'v_rotavirus1', 'v_rotavirus2', 'v_rotavirus3', 'created_at'],
    rows: laporanImunisasi,
  },
  Laporan_KB: {
    headers: ['id', 'tanggal', 'pasien', 'metode', 'jml_anak', 'usia_anak', 'anemia', 'lila', 'kronis', 'ims', 'keterangan', 'created_at'],
    rows: laporanKB,
  },
  Site_Settings: {
    headers: ['key', 'value'],
    rows: siteSettings,
  },
  Hero_Content: {
    headers: ['id', 'badge', 'title', 'subtitle', 'primary_cta_text', 'primary_cta_link', 'secondary_cta_text', 'secondary_cta_link', 'is_active'],
    rows: heroContent,
  },
  Feature_Items: {
    headers: ['id', 'icon', 'title', 'description', 'sort_order', 'is_active'],
    rows: featureItems,
  },
  Pricing_Plans: {
    headers: ['id', 'plan_name', 'billing_type', 'price', 'subtitle', 'features', 'cta_text', 'highlight_flag', 'is_active', 'sort_order'],
    rows: pricingPlans,
  },
  Audit_Log: {
    headers: ['log_id', 'action', 'resource', 'actor', 'detail', 'created_at'],
    rows: auditLog,
  },
  Master_Layanan: {
    headers: ['layanan_id', 'nama_layanan', 'status_aktif', 'sort_order'],
    rows: masterLayanan,
  },
  Master_Kategori_Keuangan: {
    headers: ['kategori_id', 'jenis', 'nama_kategori', 'status_aktif', 'sort_order'],
    rows: masterKategori,
  },
}

function csvEscape(value) {
  const text = String(value ?? '')
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

function toCsv(headers, rows) {
  const head = headers.map(csvEscape).join(',')
  const body = rows.map((row) => headers.map((_, idx) => csvEscape(row[idx] ?? '')).join(',')).join('\n')
  return `${head}\n${body}\n`
}

await mkdir(outDir, { recursive: true })

for (const [sheetName, data] of Object.entries(sheets)) {
  const csv = toCsv(data.headers, data.rows)
  await writeFile(resolve(outDir, `${sheetName}.csv`), csv, 'utf8')
}

const summary = {
  generated_at: toDateTime(baseNow),
  total_sheets: Object.keys(sheets).length,
  row_counts: Object.fromEntries(Object.entries(sheets).map(([name, data]) => [name, data.rows.length])),
}

await writeFile(resolve(outDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8')
