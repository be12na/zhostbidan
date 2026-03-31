import { useEffect, useMemo, useState } from 'react'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { DataTable } from '../../components/ui/DataTable'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { Pagination } from '../../components/ui/Pagination'
import { PageHeader } from '../../components/ui/PageHeader'
import { queueSchema } from '../../lib/validators'
import { useResource } from '../../hooks/useResource'
import { patientsService, queueService } from '../../services/api/services'
import type { Patient } from '../../types/domain'
import { todayDateISO } from '../../utils/date'

const PAGE_SIZE = 10

type QueueStatus = 'Menunggu' | 'Diperiksa' | 'Selesai' | 'Batal'

interface QueueForm {
  tanggal: string
  pasien_id: string
  layanan: string
  status: QueueStatus
}

export function QueuePage() {
  const { items, loading, error, refresh, create, update, remove } = useResource(queueService)
  const [patients, setPatients] = useState<Patient[]>([])
  const [editingId, setEditingId] = useState('')
  const [form, setForm] = useState<QueueForm>({ tanggal: todayDateISO(), pasien_id: '', layanan: 'Pemeriksaan Umum', status: 'Menunggu' })
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [submitError, setSubmitError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState('')
  const [deleting, setDeleting] = useState(false)

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
    const q = search.toLowerCase().trim()
    return items.filter((item) => {
      const passStatus = filterStatus ? item.status === filterStatus : true
      const passDate = filterDate ? item.tanggal === filterDate : true
      const passSearch = q
        ? [item.nama_pasien, item.id_antrian, item.layanan, item.status].some((val) => val.toLowerCase().includes(q))
        : true
      return passStatus && passDate && passSearch
    })
  }, [items, filterDate, filterStatus, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const counts = useMemo(
    () => ({
      total: items.length,
      menunggu: items.filter((item) => item.status === 'Menunggu').length,
      diperiksa: items.filter((item) => item.status === 'Diperiksa').length,
      selesai: items.filter((item) => item.status === 'Selesai').length,
    }),
    [items],
  )

  const resetForm = () => {
    setEditingId('')
    setForm({ tanggal: todayDateISO(), pasien_id: '', layanan: 'Pemeriksaan Umum', status: 'Menunggu' })
    setSubmitError('')
  }

  const targetDelete = items.find((item) => item.id_antrian === confirmDeleteId)

  return (
    <div className="stack-lg">
      <PageHeader title="Modul Antrian" description="Kelola antrian pasien dengan CRUD lengkap." />
      <div className="grid-4">
        <article className="card"><h3>Total</h3><p className="metric">{counts.total}</p></article>
        <article className="card"><h3>Menunggu</h3><p className="metric">{counts.menunggu}</p></article>
        <article className="card"><h3>Diperiksa</h3><p className="metric">{counts.diperiksa}</p></article>
        <article className="card"><h3>Selesai</h3><p className="metric">{counts.selesai}</p></article>
      </div>

      <div className="card">
        <div className="row between">
          <h3>{editingId ? 'Edit Antrian' : 'Tambah Antrian'}</h3>
          {editingId ? (
            <button className="btn btn-secondary" type="button" onClick={resetForm}>
              Batal Edit
            </button>
          ) : null}
        </div>
        <form
          className="grid-4"
          onSubmit={async (event) => {
            event.preventDefault()
            setSubmitError('')
            setFeedback('')
            try {
              const parsed = queueSchema.parse(form)
              if (editingId) {
                const selectedPatient = patients.find((item) => item.pasien_id === form.pasien_id)
                await update({
                  id_antrian: editingId,
                  tanggal: form.tanggal,
                  pasien_id: form.pasien_id,
                  nama_pasien: selectedPatient?.nama ?? '',
                  layanan: form.layanan,
                  status: form.status,
                })
                setFeedback('Data antrian berhasil diperbarui.')
              } else {
                await create({ ...parsed, status: form.status })
                setFeedback('Data antrian berhasil ditambahkan.')
              }
              resetForm()
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
          <label className="field">
            <span>Status</span>
            <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as 'Menunggu' | 'Diperiksa' | 'Selesai' | 'Batal' }))}>
              <option value="Menunggu">Menunggu</option>
              <option value="Diperiksa">Diperiksa</option>
              <option value="Selesai">Selesai</option>
              <option value="Batal">Batal</option>
            </select>
          </label>
          <button className="btn" type="submit">
            {editingId ? 'Simpan Perubahan' : 'Simpan Antrian'}
          </button>
          {submitError ? <p className="error-text grid-span-4">{submitError}</p> : null}
          {feedback ? <p className="success-text grid-span-4">{feedback}</p> : null}
        </form>
      </div>

      <div className="card">
        <div className="row between">
          <h3>Daftar Antrian</h3>
          <div className="row">
            <input placeholder="Cari ID/Nama/Layanan/Status" value={search} onChange={(e) => setSearch(e.target.value)} />
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
        {!loading && !error && paged.length === 0 ? <EmptyState /> : null}
        {!loading && !error && paged.length > 0 ? (
          <>
            <DataTable
              rows={paged}
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
                      onChange={(e) =>
                        void update({
                          id_antrian: row.id_antrian,
                          status: e.target.value as 'Menunggu' | 'Diperiksa' | 'Selesai' | 'Batal',
                          diagnosa_ringkas: row.diagnosa_ringkas,
                          analisa_ringkas: row.analisa_ringkas,
                        })
                      }
                    >
                      <option value="Menunggu">Menunggu</option>
                      <option value="Diperiksa">Diperiksa</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Batal">Batal</option>
                    </select>
                  ),
                },
                {
                  header: 'Aksi',
                  cell: (row) => (
                    <div className="row">
                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => {
                          setEditingId(row.id_antrian)
                          setForm({
                            tanggal: row.tanggal,
                            pasien_id: row.pasien_id,
                            layanan: row.layanan,
                            status: row.status,
                          })
                        }}
                      >
                        Edit
                      </button>
                      <button className="btn btn-danger" type="button" onClick={() => setConfirmDeleteId(row.id_antrian)}>
                        Hapus
                      </button>
                    </div>
                  ),
                },
              ]}
            />
            <Pagination totalItems={filtered.length} page={currentPage} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </>
        ) : null}
      </div>

      <ConfirmDialog
        open={Boolean(confirmDeleteId)}
        title="Hapus Antrian"
        message={`Yakin ingin menghapus antrian ${targetDelete?.id_antrian ?? ''}?`}
        busy={deleting}
        onCancel={() => setConfirmDeleteId('')}
        onConfirm={() => {
          void (async () => {
            if (!confirmDeleteId) return
            setDeleting(true)
            try {
              await remove({ id_antrian: confirmDeleteId })
              setFeedback('Data antrian berhasil dihapus.')
            } catch (err) {
              setSubmitError(err instanceof Error ? err.message : 'Gagal menghapus antrian')
            } finally {
              setDeleting(false)
              setConfirmDeleteId('')
              if (editingId === confirmDeleteId) resetForm()
            }
          })()
        }}
      />
    </div>
  )
}
