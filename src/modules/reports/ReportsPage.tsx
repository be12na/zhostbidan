import { useCallback, useEffect, useMemo, useState } from 'react'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { DataTable } from '../../components/ui/DataTable'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { FormField } from '../../components/ui/FormField'
import { LoadingState } from '../../components/ui/LoadingState'
import { Pagination } from '../../components/ui/Pagination'
import { PageHeader } from '../../components/ui/PageHeader'
import { REPORT_FIELDS, REPORT_TYPE_OPTIONS, type ReportType } from '../../constants/reports'
import { reportsService } from '../../services/api/services'
import type { ReportRecord } from '../../types/domain'
import { exportToCSV } from '../../utils/exportCsv'
import { todayDateISO } from '../../utils/date'

const PAGE_SIZE = 10

export function ReportsPage() {
  const [type, setType] = useState<ReportType>('anc')
  const [items, setItems] = useState<ReportRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [editingId, setEditingId] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [form, setForm] = useState<Record<string, string>>({ tanggal: todayDateISO(), pasien: '', keterangan: '' })

  const load = useCallback(async (selectedType: ReportType) => {
    setLoading(true)
    setError('')
    try {
      setItems(await reportsService.list(selectedType))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat laporan')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load(type)
  }, [type, load])

  const fields = useMemo(() => REPORT_FIELDS[type], [type])
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return items
    return items.filter((item) => [item.id, item.pasien, item.keterangan, item.tanggal].some((v) => String(v ?? '').toLowerCase().includes(q)))
  }, [items, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const resetForm = () => {
    setEditingId('')
    setForm({ tanggal: todayDateISO(), pasien: '', keterangan: '' })
  }

  const targetDelete = items.find((item) => item.id === confirmDeleteId)

  return (
    <div className="stack-lg">
      <PageHeader
        title="Laporan Klinik"
        description="Manajemen data laporan per jenis dengan CRUD lengkap."
        rightContent={
          <button className="btn btn-secondary" onClick={() => exportToCSV(`laporan-${type}.csv`, filtered)} type="button">
            Export CSV
          </button>
        }
      />

      <div className="card">
        <div className="row between">
          <h3>{editingId ? 'Edit Laporan' : 'Input Laporan'}</h3>
          <div className="row">
            <label className="field-inline">
              <span>Jenis</span>
              <select value={type} onChange={(e) => setType(e.target.value as ReportType)}>
                {REPORT_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            {editingId ? (
              <button className="btn btn-secondary" type="button" onClick={resetForm}>
                Batal Edit
              </button>
            ) : null}
          </div>
        </div>

        <form
          className="grid-3"
          onSubmit={async (event) => {
            event.preventDefault()
            setFeedback('')
            try {
              if (editingId) {
                await reportsService.update(type, { ...form, id: editingId })
                setFeedback('Laporan berhasil diperbarui.')
              } else {
                await reportsService.create(type, form)
                setFeedback('Laporan berhasil ditambahkan.')
              }
              await load(type)
              resetForm()
            } catch (err) {
              setFeedback(err instanceof Error ? err.message : 'Gagal menyimpan laporan')
            }
          }}
        >
          {fields.map((field) => (
            <FormField
              key={field.key}
              label={field.label}
              value={form[field.key] ?? ''}
              onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
              type={field.key.includes('tanggal') ? 'date' : 'text'}
            />
          ))}
          <button className="btn" type="submit">
            {editingId ? 'Simpan Perubahan' : 'Simpan Laporan'}
          </button>
          {feedback ? <p className={feedback.toLowerCase().includes('gagal') ? 'error-text grid-span-3' : 'success-text grid-span-3'}>{feedback}</p> : null}
        </form>
      </div>

      <div className="card">
        <div className="row between">
          <h3>Data Laporan</h3>
          <input placeholder="Cari ID/Pasien/Tanggal/Keterangan" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={() => void load(type)} /> : null}
        {!loading && !error && paged.length === 0 ? <EmptyState /> : null}
        {!loading && !error && paged.length > 0 ? (
          <>
            <DataTable
              rows={paged}
              columns={[
                { header: 'ID', cell: (row) => row.id },
                { header: 'Tanggal', cell: (row) => row.tanggal || '-' },
                { header: 'Pasien', cell: (row) => row.pasien || '-' },
                { header: 'Keterangan', cell: (row) => row.keterangan || '-' },
                {
                  header: 'Aksi',
                  cell: (row) => (
                    <div className="row">
                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => {
                          setEditingId(row.id)
                          const nextForm: Record<string, string> = {}
                          fields.forEach((f) => {
                            nextForm[f.key] = String(row[f.key] ?? '')
                          })
                          setForm(nextForm)
                        }}
                      >
                        Edit
                      </button>
                      <button className="btn btn-danger" type="button" onClick={() => setConfirmDeleteId(row.id)}>
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
        title="Hapus Laporan"
        message={`Yakin ingin menghapus laporan ${targetDelete?.id ?? ''}?`}
        busy={deleting}
        onCancel={() => setConfirmDeleteId('')}
        onConfirm={() => {
          void (async () => {
            if (!confirmDeleteId) return
            setDeleting(true)
            try {
              await reportsService.remove(type, confirmDeleteId)
              setFeedback('Laporan berhasil dihapus.')
              await load(type)
            } catch (err) {
              setFeedback(err instanceof Error ? err.message : 'Gagal menghapus laporan')
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
