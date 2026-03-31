import { useMemo, useState } from 'react'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { DataTable } from '../../components/ui/DataTable'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { FormField } from '../../components/ui/FormField'
import { LoadingState } from '../../components/ui/LoadingState'
import { Pagination } from '../../components/ui/Pagination'
import { PageHeader } from '../../components/ui/PageHeader'
import { patientSchema } from '../../lib/validators'
import { useResource } from '../../hooks/useResource'
import { patientsService } from '../../services/api/services'
import { calculateAge } from '../../utils/date'

const PAGE_SIZE = 10

export function PatientsPage() {
  const { items, loading, error, refresh, create, update, remove } = useResource(patientsService)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [editingId, setEditingId] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [submitError, setSubmitError] = useState('')

  const [form, setForm] = useState({ nama: '', nik: '', hp: '', tanggal_lahir: '', jenis_kelamin: 'P' as 'L' | 'P' })

  const filteredItems = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return items
    return items.filter((item) => [item.nama, item.no_rm, item.nik, item.hp].some((value) => value.toLowerCase().includes(q)))
  }, [items, search])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pagedItems = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const resetForm = () => {
    setForm({ nama: '', nik: '', hp: '', tanggal_lahir: '', jenis_kelamin: 'P' })
    setEditingId('')
    setSubmitError('')
  }

  const targetDelete = items.find((item) => item.pasien_id === confirmDeleteId)

  return (
    <div className="stack-lg">
      <PageHeader title="Data Pasien" description="Kelola data pasien lengkap (tambah, ubah, hapus)." />

      <div className="card">
        <div className="row between">
          <h3>{editingId ? 'Edit Pasien' : 'Input Pasien Baru'}</h3>
          {editingId ? (
            <button className="btn btn-secondary" type="button" onClick={resetForm}>
              Batal Edit
            </button>
          ) : null}
        </div>
        <form
          className="grid-3"
          onSubmit={async (event) => {
            event.preventDefault()
            setSubmitError('')
            setFeedback('')
            try {
              const parsed = patientSchema.parse(form)
              if (editingId) {
                await update({ pasien_id: editingId, ...parsed })
                setFeedback('Data pasien berhasil diperbarui.')
              } else {
                await create(parsed)
                setFeedback('Data pasien berhasil ditambahkan.')
              }
              resetForm()
            } catch (err) {
              setSubmitError(err instanceof Error ? err.message : 'Gagal menyimpan pasien')
            }
          }}
        >
          <FormField label="Nama" value={form.nama} onChange={(e) => setForm((prev) => ({ ...prev, nama: e.target.value }))} required />
          <FormField label="NIK" value={form.nik} onChange={(e) => setForm((prev) => ({ ...prev, nik: e.target.value }))} required />
          <FormField label="No HP" value={form.hp} onChange={(e) => setForm((prev) => ({ ...prev, hp: e.target.value }))} required />
          <FormField
            label="Tanggal Lahir"
            type="date"
            value={form.tanggal_lahir}
            onChange={(e) => setForm((prev) => ({ ...prev, tanggal_lahir: e.target.value }))}
            required
          />
          <label className="field">
            <span>Jenis Kelamin</span>
            <select
              value={form.jenis_kelamin}
              onChange={(e) => setForm((prev) => ({ ...prev, jenis_kelamin: e.target.value as 'L' | 'P' }))}
            >
              <option value="P">Perempuan</option>
              <option value="L">Laki-laki</option>
            </select>
          </label>
          <div className="field">
            <span>Umur (otomatis)</span>
            <input value={`${calculateAge(form.tanggal_lahir)} tahun`} readOnly />
          </div>
          <button className="btn" type="submit">
            {editingId ? 'Simpan Perubahan' : 'Simpan Pasien'}
          </button>
          {submitError ? <p className="error-text grid-span-3">{submitError}</p> : null}
          {feedback ? <p className="success-text grid-span-3">{feedback}</p> : null}
        </form>
      </div>

      <div className="card">
        <div className="row between">
          <h3>Daftar Pasien</h3>
          <div className="row">
            <input placeholder="Cari nama / no RM / NIK / HP" value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="btn btn-secondary" onClick={() => void refresh()} type="button">
              Refresh
            </button>
          </div>
        </div>

        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={() => void refresh()} /> : null}
        {!loading && !error && pagedItems.length === 0 ? <EmptyState /> : null}
        {!loading && !error && pagedItems.length > 0 ? (
          <>
            <DataTable
              rows={pagedItems}
              columns={[
                { header: 'No RM', cell: (row) => row.no_rm },
                { header: 'Nama', cell: (row) => row.nama },
                { header: 'NIK', cell: (row) => row.nik },
                { header: 'HP', cell: (row) => row.hp },
                { header: 'Last Visit', cell: (row) => row.last_visit || '-' },
                {
                  header: 'Aksi',
                  cell: (row) => (
                    <div className="row">
                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => {
                          setEditingId(row.pasien_id)
                          setForm({
                            nama: row.nama,
                            nik: row.nik,
                            hp: row.hp,
                            tanggal_lahir: row.tanggal_lahir,
                            jenis_kelamin: row.jenis_kelamin,
                          })
                        }}
                      >
                        Edit
                      </button>
                      <button className="btn btn-danger" type="button" onClick={() => setConfirmDeleteId(row.pasien_id)}>
                        Hapus
                      </button>
                    </div>
                  ),
                },
              ]}
            />
            <Pagination totalItems={filteredItems.length} page={currentPage} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </>
        ) : null}
      </div>

      <ConfirmDialog
        open={Boolean(confirmDeleteId)}
        title="Hapus Pasien"
        message={`Yakin ingin menghapus data ${targetDelete?.nama ?? ''}?`}
        busy={deleting}
        onCancel={() => setConfirmDeleteId('')}
        onConfirm={() => {
          void (async () => {
            if (!confirmDeleteId) return
            setDeleting(true)
            setFeedback('')
            try {
              await remove({ pasien_id: confirmDeleteId })
              setFeedback('Data pasien berhasil dihapus.')
            } catch (err) {
              setSubmitError(err instanceof Error ? err.message : 'Gagal menghapus pasien')
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
