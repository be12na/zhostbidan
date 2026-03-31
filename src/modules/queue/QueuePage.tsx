import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '../../components/ui/DataTable'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { PageHeader } from '../../components/ui/PageHeader'
import { queueSchema } from '../../lib/validators'
import { useResource } from '../../hooks/useResource'
import { patientsService, queueService } from '../../services/api/services'
import type { Patient } from '../../types/domain'
import { todayDateISO } from '../../utils/date'

export function QueuePage() {
  const { items, loading, error, refresh, create, update } = useResource(queueService)
  const [patients, setPatients] = useState<Patient[]>([])
  const [form, setForm] = useState({ tanggal: todayDateISO(), pasien_id: '', layanan: 'Pemeriksaan Umum', status: 'Menunggu' as const })
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setPatients(await patientsService.list())
      } catch {
        setPatients([])
      }
    }
    void loadPatients()
  }, [])

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const passStatus = filterStatus ? item.status === filterStatus : true
      const passDate = filterDate ? item.tanggal === filterDate : true
      return passStatus && passDate
    })
  }, [items, filterDate, filterStatus])

  const counts = useMemo(
    () => ({
      total: items.length,
      menunggu: items.filter((item) => item.status === 'Menunggu').length,
      diperiksa: items.filter((item) => item.status === 'Diperiksa').length,
      selesai: items.filter((item) => item.status === 'Selesai').length,
    }),
    [items],
  )

  return (
    <div className="stack-lg">
      <PageHeader title="Modul Antrian" description="Kelola antrian pasien dari sheet Antrian." />
      <div className="grid-4">
        <article className="card"><h3>Total</h3><p className="metric">{counts.total}</p></article>
        <article className="card"><h3>Menunggu</h3><p className="metric">{counts.menunggu}</p></article>
        <article className="card"><h3>Diperiksa</h3><p className="metric">{counts.diperiksa}</p></article>
        <article className="card"><h3>Selesai</h3><p className="metric">{counts.selesai}</p></article>
      </div>

      <div className="card">
        <h3>Tambah Antrian</h3>
        <form
          className="grid-4"
          onSubmit={async (event) => {
            event.preventDefault()
            setSubmitError('')
            try {
              const parsed = queueSchema.parse(form)
              await create({ ...parsed, status: 'Menunggu' })
            } catch (err) {
              setSubmitError(err instanceof Error ? err.message : 'Gagal simpan antrian')
            }
          }}
        >
          <label className="field">
            <span>Tanggal</span>
            <input type="date" value={form.tanggal} onChange={(e) => setForm((prev) => ({ ...prev, tanggal: e.target.value }))} required />
          </label>
          <label className="field">
            <span>Pasien</span>
            <select value={form.pasien_id} onChange={(e) => setForm((prev) => ({ ...prev, pasien_id: e.target.value }))} required>
              <option value="">Pilih pasien</option>
              {patients.map((patient) => (
                <option key={patient.pasien_id} value={patient.pasien_id}>
                  {patient.nama} ({patient.no_rm})
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Layanan</span>
            <input value={form.layanan} onChange={(e) => setForm((prev) => ({ ...prev, layanan: e.target.value }))} required />
          </label>
          <button className="btn" type="submit">
            Simpan Antrian
          </button>
          {submitError ? <p className="error-text grid-span-4">{submitError}</p> : null}
        </form>
      </div>

      <div className="card">
        <div className="row between">
          <h3>Daftar Antrian</h3>
          <div className="row">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">Semua Status</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Diperiksa">Diperiksa</option>
              <option value="Selesai">Selesai</option>
              <option value="Batal">Batal</option>
            </select>
            <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          </div>
        </div>

        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={() => void refresh()} /> : null}
        {!loading && !error && filtered.length === 0 ? <EmptyState /> : null}
        {!loading && !error && filtered.length > 0 ? (
          <DataTable
            rows={filtered}
            columns={[
              { header: 'ID', cell: (row) => row.id_antrian },
              { header: 'Tanggal', cell: (row) => row.tanggal },
              { header: 'Pasien', cell: (row) => row.nama_pasien },
              { header: 'Layanan', cell: (row) => row.layanan },
              {
                header: 'Status',
                cell: (row) => (
                  <select
                    value={row.status}
                    onChange={(e) => void update({ id_antrian: row.id_antrian, status: e.target.value as 'Menunggu' | 'Diperiksa' | 'Selesai' | 'Batal', diagnosa_ringkas: row.diagnosa_ringkas, analisa_ringkas: row.analisa_ringkas })}
                  >
                    <option value="Menunggu">Menunggu</option>
                    <option value="Diperiksa">Diperiksa</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Batal">Batal</option>
                  </select>
                ),
              },
            ]}
          />
        ) : null}
      </div>
    </div>
  )
}
