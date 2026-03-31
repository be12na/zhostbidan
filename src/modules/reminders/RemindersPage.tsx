import { useMemo, useState } from 'react'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { DataTable } from '../../components/ui/DataTable'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { FormField } from '../../components/ui/FormField'
import { LoadingState } from '../../components/ui/LoadingState'
import { Pagination } from '../../components/ui/Pagination'
import { PageHeader } from '../../components/ui/PageHeader'
import { useResource } from '../../hooks/useResource'
import { remindersService } from '../../services/api/services'
import { normalizeIndonesianPhone } from '../../utils/phone'
import { todayDateISO } from '../../utils/date'

const PAGE_SIZE = 10

type ReminderStatus = 'Belum Dihubungi' | 'Sudah Dihubungi' | 'Follow Up Ulang'

interface ReminderForm {
  pasien_id: string
  nama: string
  no_wa: string
  jenis: string
  waktu: string
  status: ReminderStatus
  catatan_cs: string
}

export function RemindersPage() {
  const { items, loading, error, refresh, create, update, remove } = useResource(remindersService)
  const [editingId, setEditingId] = useState('')
  const [form, setForm] = useState<ReminderForm>({ pasien_id: '', nama: '', no_wa: '', jenis: '', waktu: todayDateISO(), status: 'Belum Dihubungi', catatan_cs: '' })
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [feedback, setFeedback] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState('')
  const [deleting, setDeleting] = useState(false)

  const filteredItems = useMemo(() => {
    const q = search.toLowerCase().trim()
    return items.filter((item) => {
      const statusOk = statusFilter ? item.status === statusFilter : true
      const dateOk = dateFilter ? item.waktu === dateFilter : true
      const searchOk = q ? [item.nama, item.jenis, item.no_wa, item.status].some((val) => val.toLowerCase().includes(q)) : true
      return statusOk && dateOk && searchOk
    })
  }, [items, dateFilter, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const resetForm = () => {
    setEditingId('')
    setForm({ pasien_id: '', nama: '', no_wa: '', jenis: '', waktu: todayDateISO(), status: 'Belum Dihubungi', catatan_cs: '' })
    setSubmitError('')
  }

  const targetDelete = items.find((item) => item.reminder_id === confirmDeleteId)

  return (
    <div className="stack-lg">
      <PageHeader title="Reminder Pasien" description="Kelola reminder follow-up pasien dengan CRUD lengkap." />

      <div className="card">
        <div className="row between">
          <h3>{editingId ? 'Edit Reminder' : 'Tambah Reminder'}</h3>
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
              if (editingId) {
                await update({ reminder_id: editingId, ...form })
                setFeedback('Reminder berhasil diperbarui.')
              } else {
                await create(form)
                setFeedback('Reminder berhasil ditambahkan.')
              }
              resetForm()
            } catch (err) {
              setSubmitError(err instanceof Error ? err.message : 'Gagal simpan reminder')
            }
          }}
        >
          <FormField label="Pasien ID" value={form.pasien_id} onChange={(e) => setForm((prev) => ({ ...prev, pasien_id: e.target.value }))} required />
          <FormField label="Nama" value={form.nama} onChange={(e) => setForm((prev) => ({ ...prev, nama: e.target.value }))} required />
          <FormField label="No WhatsApp" value={form.no_wa} onChange={(e) => setForm((prev) => ({ ...prev, no_wa: e.target.value }))} required />
          <FormField label="Jenis" value={form.jenis} onChange={(e) => setForm((prev) => ({ ...prev, jenis: e.target.value }))} required />
          <FormField label="Waktu" type="date" value={form.waktu} onChange={(e) => setForm((prev) => ({ ...prev, waktu: e.target.value }))} required />
          <label className="field">
            <span>Status</span>
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as 'Belum Dihubungi' | 'Sudah Dihubungi' | 'Follow Up Ulang' }))}
            >
              <option value="Belum Dihubungi">Belum Dihubungi</option>
              <option value="Sudah Dihubungi">Sudah Dihubungi</option>
              <option value="Follow Up Ulang">Follow Up Ulang</option>
            </select>
          </label>
          <FormField label="Catatan CS" value={form.catatan_cs} onChange={(e) => setForm((prev) => ({ ...prev, catatan_cs: e.target.value }))} />
          <button className="btn" type="submit">
            {editingId ? 'Simpan Perubahan' : 'Tambah Reminder'}
          </button>
          {submitError ? <p className="error-text grid-span-4">{submitError}</p> : null}
          {feedback ? <p className="success-text grid-span-4">{feedback}</p> : null}
        </form>
      </div>

      <div className="card">
        <div className="row between">
          <h3>Daftar Reminder</h3>
          <div className="row">
            <input placeholder="Cari nama/jenis/no WA/status" value={search} onChange={(e) => setSearch(e.target.value)} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Semua</option>
              <option value="Belum Dihubungi">Belum Dihubungi</option>
              <option value="Sudah Dihubungi">Sudah Dihubungi</option>
              <option value="Follow Up Ulang">Follow Up Ulang</option>
            </select>
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
            <button className="btn btn-secondary" onClick={() => void refresh()} type="button">
              Refresh
            </button>
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
                { header: 'Nama', cell: (row) => row.nama },
                { header: 'Jenis', cell: (row) => row.jenis },
                { header: 'Waktu', cell: (row) => row.waktu },
                { header: 'Status', cell: (row) => row.status },
                {
                  header: 'Aksi',
                  cell: (row) => {
                    const waPhone = normalizeIndonesianPhone(row.no_wa)
                    const waMessage = encodeURIComponent(`Halo ${row.nama}, kami mengingatkan jadwal ${row.jenis} pada ${row.waktu}.`)
                    return (
                      <div className="row">
                        <button
                          className="btn btn-secondary"
                          type="button"
                          onClick={() => {
                            setEditingId(row.reminder_id)
                            setForm({
                              pasien_id: row.pasien_id,
                              nama: row.nama,
                              no_wa: row.no_wa,
                              jenis: row.jenis,
                              waktu: row.waktu,
                              status: row.status,
                              catatan_cs: row.catatan_cs,
                            })
                          }}
                        >
                          Edit
                        </button>
                        <button className="btn btn-danger" type="button" onClick={() => setConfirmDeleteId(row.reminder_id)}>
                          Hapus
                        </button>
                        <a className="btn btn-secondary" href={`https://wa.me/${waPhone}?text=${waMessage}`} rel="noreferrer" target="_blank">
                          Kirim WA
                        </a>
                      </div>
                    )
                  },
                },
              ]}
            />
            <Pagination totalItems={filteredItems.length} page={currentPage} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </>
        ) : null}
      </div>

      <ConfirmDialog
        open={Boolean(confirmDeleteId)}
        title="Hapus Reminder"
        message={`Yakin ingin menghapus reminder ${targetDelete?.nama ?? ''}?`}
        busy={deleting}
        onCancel={() => setConfirmDeleteId('')}
        onConfirm={() => {
          void (async () => {
            if (!confirmDeleteId) return
            setDeleting(true)
            try {
              await remove({ reminder_id: confirmDeleteId })
              setFeedback('Reminder berhasil dihapus.')
            } catch (err) {
              setSubmitError(err instanceof Error ? err.message : 'Gagal menghapus reminder')
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
