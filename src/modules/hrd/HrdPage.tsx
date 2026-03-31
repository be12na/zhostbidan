import { useState } from 'react'
import { DataTable } from '../../components/ui/DataTable'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { FormField } from '../../components/ui/FormField'
import { LoadingState } from '../../components/ui/LoadingState'
import { PageHeader } from '../../components/ui/PageHeader'
import { useAuth } from '../auth/useAuth'
import { useResource } from '../../hooks/useResource'
import { attendanceService, employeesService } from '../../services/api/services'
import { exportToCSV } from '../../utils/exportCsv'
import { todayDateISO } from '../../utils/date'

type AttendanceStatus = 'Hadir' | 'Izin' | 'Cuti' | 'Libur' | 'Lembur'

interface AttendanceForm {
  tanggal: string
  karyawan_id: string
  status: AttendanceStatus
  lembur_jam: number
  catatan: string
}

export function HrdPage() {
  const { user } = useAuth()
  const employees = useResource(employeesService)
  const attendance = useResource(attendanceService)
  const [activeTab, setActiveTab] = useState<'employees' | 'attendance'>('employees')
  const [employeeForm, setEmployeeForm] = useState({ nama: '', posisi: '', kontak: '', jadwal: '', status_aktif: 'Aktif' as const })
  const [attendanceForm, setAttendanceForm] = useState<AttendanceForm>({
    tanggal: todayDateISO(),
    karyawan_id: '',
    status: 'Hadir',
    lembur_jam: 0,
    catatan: '',
  })

  return (
    <div className="stack-lg">
      <PageHeader
        title="Karyawan & HRD"
        description="Data karyawan dari sheet Karyawan dan absensi dari sheet Absensi."
        rightContent={
          <button className="btn btn-secondary" onClick={() => exportToCSV('absensi.csv', attendance.items)} type="button">
            Export Absensi CSV
          </button>
        }
      />

      <div className="row">
        <button className={activeTab === 'employees' ? 'btn' : 'btn btn-secondary'} onClick={() => setActiveTab('employees')} type="button">
          Karyawan
        </button>
        <button className={activeTab === 'attendance' ? 'btn' : 'btn btn-secondary'} onClick={() => setActiveTab('attendance')} type="button">
          Absensi
        </button>
      </div>

      {activeTab === 'employees' ? (
        <>
          <div className="card">
            <h3>Input Karyawan</h3>
            <form
              className="grid-4"
              onSubmit={async (event) => {
                event.preventDefault()
                await employees.create(employeeForm)
                setEmployeeForm({ nama: '', posisi: '', kontak: '', jadwal: '', status_aktif: 'Aktif' })
              }}
            >
              <FormField label="Nama" value={employeeForm.nama} onChange={(e) => setEmployeeForm((p) => ({ ...p, nama: e.target.value }))} required />
              <FormField label="Posisi" value={employeeForm.posisi} onChange={(e) => setEmployeeForm((p) => ({ ...p, posisi: e.target.value }))} required />
              <FormField label="Kontak" value={employeeForm.kontak} onChange={(e) => setEmployeeForm((p) => ({ ...p, kontak: e.target.value }))} required />
              <FormField label="Jadwal" value={employeeForm.jadwal} onChange={(e) => setEmployeeForm((p) => ({ ...p, jadwal: e.target.value }))} required />
              <button className="btn" type="submit">Simpan Karyawan</button>
            </form>
          </div>

          <div className="card">
            {employees.loading ? <LoadingState /> : null}
            {employees.error ? <ErrorState message={employees.error} onRetry={() => void employees.refresh()} /> : null}
            {!employees.loading && !employees.error && employees.items.length === 0 ? <EmptyState /> : null}
            {!employees.loading && !employees.error && employees.items.length > 0 ? (
              <DataTable
                rows={employees.items}
                columns={[
                  { header: 'ID', cell: (row) => row.karyawan_id },
                  { header: 'Nama', cell: (row) => row.nama },
                  { header: 'Posisi', cell: (row) => row.posisi },
                  { header: 'Kontak', cell: (row) => row.kontak },
                  { header: 'Jadwal', cell: (row) => row.jadwal },
                ]}
              />
            ) : null}
          </div>
        </>
      ) : (
        <>
          <div className="card">
            <h3>Input Absensi</h3>
            <form
              className="grid-4"
              onSubmit={async (event) => {
                event.preventDefault()
                await attendance.create({ ...attendanceForm, input_by: user?.email ?? 'system' })
                setAttendanceForm({ tanggal: todayDateISO(), karyawan_id: '', status: 'Hadir', lembur_jam: 0, catatan: '' })
              }}
            >
              <FormField label="Tanggal" type="date" value={attendanceForm.tanggal} onChange={(e) => setAttendanceForm((p) => ({ ...p, tanggal: e.target.value }))} required />
              <label className="field">
                <span>Karyawan</span>
                <select value={attendanceForm.karyawan_id} onChange={(e) => setAttendanceForm((p) => ({ ...p, karyawan_id: e.target.value }))} required>
                  <option value="">Pilih karyawan</option>
                  {employees.items.map((employee) => (
                    <option key={employee.karyawan_id} value={employee.karyawan_id}>
                      {employee.nama}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Status</span>
                <select value={attendanceForm.status} onChange={(e) => setAttendanceForm((p) => ({ ...p, status: e.target.value as 'Hadir' | 'Izin' | 'Cuti' | 'Libur' | 'Lembur' }))}>
                  <option value="Hadir">Hadir</option>
                  <option value="Izin">Izin</option>
                  <option value="Cuti">Cuti</option>
                  <option value="Libur">Libur</option>
                  <option value="Lembur">Lembur</option>
                </select>
              </label>
              <FormField label="Lembur (jam)" type="number" value={String(attendanceForm.lembur_jam)} onChange={(e) => setAttendanceForm((p) => ({ ...p, lembur_jam: Number(e.target.value) }))} />
              <FormField label="Catatan" value={attendanceForm.catatan} onChange={(e) => setAttendanceForm((p) => ({ ...p, catatan: e.target.value }))} />
              <button className="btn" type="submit">Simpan Absensi</button>
            </form>
          </div>

          <div className="card">
            {attendance.loading ? <LoadingState /> : null}
            {attendance.error ? <ErrorState message={attendance.error} onRetry={() => void attendance.refresh()} /> : null}
            {!attendance.loading && !attendance.error && attendance.items.length === 0 ? <EmptyState /> : null}
            {!attendance.loading && !attendance.error && attendance.items.length > 0 ? (
              <DataTable
                rows={attendance.items}
                columns={[
                  { header: 'Tanggal', cell: (row) => row.tanggal },
                  { header: 'Karyawan', cell: (row) => row.karyawan_id },
                  { header: 'Status', cell: (row) => row.status },
                  { header: 'Lembur', cell: (row) => String(row.lembur_jam) },
                  { header: 'Catatan', cell: (row) => row.catatan || '-' },
                ]}
              />
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}
