import { useMemo, useState } from 'react'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { DataTable } from '../../components/ui/DataTable'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { FormField } from '../../components/ui/FormField'
import { LoadingState } from '../../components/ui/LoadingState'
import { Pagination } from '../../components/ui/Pagination'
import { PageHeader } from '../../components/ui/PageHeader'
import { useAuth } from '../auth/useAuth'
import { useResource } from '../../hooks/useResource'
import { attendanceService, employeesService } from '../../services/api/services'
import { exportToCSV } from '../../utils/exportCsv'
import { todayDateISO } from '../../utils/date'

type AttendanceStatus = 'Hadir' | 'Izin' | 'Cuti' | 'Libur' | 'Lembur'

interface AttendanceForm {
  absensi_id?: string
  tanggal: string
  karyawan_id: string
  status: AttendanceStatus
  lembur_jam: number
  catatan: string
}

const PAGE_SIZE = 8

export function HrdPage() {
  const { user } = useAuth()
  const employees = useResource(employeesService)
  const attendance = useResource(attendanceService)
  const [activeTab, setActiveTab] = useState<'employees' | 'attendance'>('employees')
  const [employeeSearch, setEmployeeSearch] = useState('')
  const [attendanceSearch, setAttendanceSearch] = useState('')
  const [employeePage, setEmployeePage] = useState(1)
  const [attendancePage, setAttendancePage] = useState(1)
  const [employeeFeedback, setEmployeeFeedback] = useState('')
  const [attendanceFeedback, setAttendanceFeedback] = useState('')

  const [employeeForm, setEmployeeForm] = useState({
    karyawan_id: '',
    nama: '',
    posisi: '',
    kontak: '',
    jadwal: '',
    status_aktif: 'Aktif' as 'Aktif' | 'Nonaktif',
  })

  const [attendanceForm, setAttendanceForm] = useState<AttendanceForm>({
    tanggal: todayDateISO(),
    karyawan_id: '',
    status: 'Hadir',
    lembur_jam: 0,
    catatan: '',
  })

  const [employeeDeleteId, setEmployeeDeleteId] = useState('')
  const [attendanceDeleteId, setAttendanceDeleteId] = useState('')
  const [deleting, setDeleting] = useState(false)

  const filteredEmployees = useMemo(() => {
    const q = employeeSearch.toLowerCase().trim()
    if (!q) return employees.items
    return employees.items.filter((item) => [item.nama, item.posisi, item.kontak, item.status_aktif].some((v) => v.toLowerCase().includes(q)))
  }, [employees.items, employeeSearch])

  const filteredAttendance = useMemo(() => {
    const q = attendanceSearch.toLowerCase().trim()
    if (!q) return attendance.items
    return attendance.items.filter((item) => [item.karyawan_id, item.status, item.catatan].some((v) => v.toLowerCase().includes(q)))
  }, [attendance.items, attendanceSearch])

  const employeeTotalPages = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE))
  const attendanceTotalPages = Math.max(1, Math.ceil(filteredAttendance.length / PAGE_SIZE))
  const employeeCurrentPage = Math.min(employeePage, employeeTotalPages)
  const attendanceCurrentPage = Math.min(attendancePage, attendanceTotalPages)
  const employeePaged = filteredEmployees.slice((employeeCurrentPage - 1) * PAGE_SIZE, employeeCurrentPage * PAGE_SIZE)
  const attendancePaged = filteredAttendance.slice((attendanceCurrentPage - 1) * PAGE_SIZE, attendanceCurrentPage * PAGE_SIZE)

  const targetEmployeeDelete = employees.items.find((item) => item.karyawan_id === employeeDeleteId)
  const targetAttendanceDelete = attendance.items.find((item) => item.absensi_id === attendanceDeleteId)

  return (
    <div className="stack-lg">
      <PageHeader
        title="Karyawan & HRD"
        description="Kelola data karyawan dan absensi dengan CRUD lengkap."
        rightContent={
          activeTab === 'employees' ? (
            <button className="btn btn-secondary" onClick={() => exportToCSV('karyawan.csv', filteredEmployees)} type="button">
              Export Karyawan CSV
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={() => exportToCSV('absensi.csv', filteredAttendance)} type="button">
              Export Absensi CSV
            </button>
          )
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
            <h3>{employeeForm.karyawan_id ? 'Edit Karyawan' : 'Input Karyawan'}</h3>
            <form
              className="grid-4"
              onSubmit={async (event) => {
                event.preventDefault()
                setEmployeeFeedback('')
                try {
                  if (employeeForm.karyawan_id) {
                    await employees.update(employeeForm)
                    setEmployeeFeedback('Data karyawan berhasil diperbarui.')
                  } else {
                    await employees.create({ ...employeeForm, status_aktif: employeeForm.status_aktif })
                    setEmployeeFeedback('Data karyawan berhasil ditambahkan.')
                  }
                  setEmployeeForm({ karyawan_id: '', nama: '', posisi: '', kontak: '', jadwal: '', status_aktif: 'Aktif' })
                } catch (err) {
                  setEmployeeFeedback(err instanceof Error ? err.message : 'Gagal menyimpan karyawan')
                }
              }}
            >
              <FormField label="Nama" value={employeeForm.nama} onChange={(e) => setEmployeeForm((p) => ({ ...p, nama: e.target.value }))} required />
              <FormField label="Posisi" value={employeeForm.posisi} onChange={(e) => setEmployeeForm((p) => ({ ...p, posisi: e.target.value }))} required />
              <FormField label="Kontak" value={employeeForm.kontak} onChange={(e) => setEmployeeForm((p) => ({ ...p, kontak: e.target.value }))} required />
              <FormField label="Jadwal" value={employeeForm.jadwal} onChange={(e) => setEmployeeForm((p) => ({ ...p, jadwal: e.target.value }))} required />
              <label className="field">
                <span>Status Aktif</span>
                <select value={employeeForm.status_aktif} onChange={(e) => setEmployeeForm((p) => ({ ...p, status_aktif: e.target.value as 'Aktif' | 'Nonaktif' }))}>
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </label>
              <button className="btn" type="submit">{employeeForm.karyawan_id ? 'Simpan Perubahan' : 'Simpan Karyawan'}</button>
              {employeeFeedback ? <p className={employeeFeedback.toLowerCase().includes('gagal') ? 'error-text grid-span-4' : 'success-text grid-span-4'}>{employeeFeedback}</p> : null}
            </form>
          </div>

          <div className="card">
            <div className="row between">
              <h3>Daftar Karyawan</h3>
              <input placeholder="Cari nama/posisi/kontak/status" value={employeeSearch} onChange={(e) => setEmployeeSearch(e.target.value)} />
            </div>

            {employees.loading ? <LoadingState /> : null}
            {employees.error ? <ErrorState message={employees.error} onRetry={() => void employees.refresh()} /> : null}
            {!employees.loading && !employees.error && employeePaged.length === 0 ? <EmptyState /> : null}
            {!employees.loading && !employees.error && employeePaged.length > 0 ? (
              <>
                <DataTable
                  rows={employeePaged}
                  columns={[
                    { header: 'ID', cell: (row) => row.karyawan_id },
                    { header: 'Nama', cell: (row) => row.nama },
                    { header: 'Posisi', cell: (row) => row.posisi },
                    { header: 'Kontak', cell: (row) => row.kontak },
                    { header: 'Jadwal', cell: (row) => row.jadwal },
                    { header: 'Status', cell: (row) => row.status_aktif },
                    {
                      header: 'Aksi',
                      cell: (row) => (
                        <div className="row">
                          <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={() =>
                              setEmployeeForm({
                                karyawan_id: row.karyawan_id,
                                nama: row.nama,
                                posisi: row.posisi,
                                kontak: row.kontak,
                                jadwal: row.jadwal,
                                status_aktif: row.status_aktif,
                              })
                            }
                          >
                            Edit
                          </button>
                          <button className="btn btn-danger" type="button" onClick={() => setEmployeeDeleteId(row.karyawan_id)}>
                            Hapus
                          </button>
                        </div>
                      ),
                    },
                  ]}
                />
                <Pagination totalItems={filteredEmployees.length} page={employeeCurrentPage} pageSize={PAGE_SIZE} onPageChange={setEmployeePage} />
              </>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <div className="card">
            <h3>{attendanceForm.absensi_id ? 'Edit Absensi' : 'Input Absensi'}</h3>
            <form
              className="grid-4"
              onSubmit={async (event) => {
                event.preventDefault()
                setAttendanceFeedback('')
                try {
                  if (attendanceForm.absensi_id) {
                    await attendance.update({ ...attendanceForm, absensi_id: attendanceForm.absensi_id })
                    setAttendanceFeedback('Data absensi berhasil diperbarui.')
                  } else {
                    await attendance.create({ ...attendanceForm, input_by: user?.email ?? 'system' })
                    setAttendanceFeedback('Data absensi berhasil ditambahkan.')
                  }
                  setAttendanceForm({ tanggal: todayDateISO(), karyawan_id: '', status: 'Hadir', lembur_jam: 0, catatan: '' })
                } catch (err) {
                  setAttendanceFeedback(err instanceof Error ? err.message : 'Gagal menyimpan absensi')
                }
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
                <select value={attendanceForm.status} onChange={(e) => setAttendanceForm((p) => ({ ...p, status: e.target.value as AttendanceStatus }))}>
                  <option value="Hadir">Hadir</option>
                  <option value="Izin">Izin</option>
                  <option value="Cuti">Cuti</option>
                  <option value="Libur">Libur</option>
                  <option value="Lembur">Lembur</option>
                </select>
              </label>
              <FormField label="Lembur (jam)" type="number" value={String(attendanceForm.lembur_jam)} onChange={(e) => setAttendanceForm((p) => ({ ...p, lembur_jam: Number(e.target.value) }))} />
              <FormField label="Catatan" value={attendanceForm.catatan} onChange={(e) => setAttendanceForm((p) => ({ ...p, catatan: e.target.value }))} />
              <button className="btn" type="submit">{attendanceForm.absensi_id ? 'Simpan Perubahan' : 'Simpan Absensi'}</button>
              {attendanceFeedback ? <p className={attendanceFeedback.toLowerCase().includes('gagal') ? 'error-text grid-span-4' : 'success-text grid-span-4'}>{attendanceFeedback}</p> : null}
            </form>
          </div>

          <div className="card">
            <div className="row between">
              <h3>Daftar Absensi</h3>
              <input placeholder="Cari karyawan/status/catatan" value={attendanceSearch} onChange={(e) => setAttendanceSearch(e.target.value)} />
            </div>

            {attendance.loading ? <LoadingState /> : null}
            {attendance.error ? <ErrorState message={attendance.error} onRetry={() => void attendance.refresh()} /> : null}
            {!attendance.loading && !attendance.error && attendancePaged.length === 0 ? <EmptyState /> : null}
            {!attendance.loading && !attendance.error && attendancePaged.length > 0 ? (
              <>
                <DataTable
                  rows={attendancePaged}
                  columns={[
                    { header: 'Tanggal', cell: (row) => row.tanggal },
                    { header: 'Karyawan', cell: (row) => row.karyawan_id },
                    { header: 'Status', cell: (row) => row.status },
                    { header: 'Lembur', cell: (row) => String(row.lembur_jam) },
                    { header: 'Catatan', cell: (row) => row.catatan || '-' },
                    {
                      header: 'Aksi',
                      cell: (row) => (
                        <div className="row">
                          <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={() =>
                              setAttendanceForm({
                                absensi_id: row.absensi_id,
                                tanggal: row.tanggal,
                                karyawan_id: row.karyawan_id,
                                status: row.status,
                                lembur_jam: row.lembur_jam,
                                catatan: row.catatan,
                              })
                            }
                          >
                            Edit
                          </button>
                          <button className="btn btn-danger" type="button" onClick={() => setAttendanceDeleteId(row.absensi_id)}>
                            Hapus
                          </button>
                        </div>
                      ),
                    },
                  ]}
                />
                <Pagination totalItems={filteredAttendance.length} page={attendanceCurrentPage} pageSize={PAGE_SIZE} onPageChange={setAttendancePage} />
              </>
            ) : null}
          </div>
        </>
      )}

      <ConfirmDialog
        open={Boolean(employeeDeleteId)}
        title="Hapus Karyawan"
        message={`Yakin ingin menghapus karyawan ${targetEmployeeDelete?.nama ?? ''}?`}
        busy={deleting}
        onCancel={() => setEmployeeDeleteId('')}
        onConfirm={() => {
          void (async () => {
            if (!employeeDeleteId) return
            setDeleting(true)
            try {
              await employees.remove({ karyawan_id: employeeDeleteId })
              setEmployeeFeedback('Data karyawan berhasil dihapus.')
            } catch (err) {
              setEmployeeFeedback(err instanceof Error ? err.message : 'Gagal menghapus karyawan')
            } finally {
              setDeleting(false)
              setEmployeeDeleteId('')
            }
          })()
        }}
      />

      <ConfirmDialog
        open={Boolean(attendanceDeleteId)}
        title="Hapus Absensi"
        message={`Yakin ingin menghapus absensi ${targetAttendanceDelete?.absensi_id ?? ''}?`}
        busy={deleting}
        onCancel={() => setAttendanceDeleteId('')}
        onConfirm={() => {
          void (async () => {
            if (!attendanceDeleteId) return
            setDeleting(true)
            try {
              await attendance.remove({ absensi_id: attendanceDeleteId })
              setAttendanceFeedback('Data absensi berhasil dihapus.')
            } catch (err) {
              setAttendanceFeedback(err instanceof Error ? err.message : 'Gagal menghapus absensi')
            } finally {
              setDeleting(false)
              setAttendanceDeleteId('')
            }
          })()
        }}
      />
    </div>
  )
}
