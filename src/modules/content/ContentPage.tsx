import { useCallback, useEffect, useMemo, useState } from 'react'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { DataTable } from '../../components/ui/DataTable'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { Modal } from '../../components/ui/Modal'
import { Pagination } from '../../components/ui/Pagination'
import { PageHeader } from '../../components/ui/PageHeader'
import { contentService } from '../../services/api/services'
import type { ContentRecord } from '../../types/domain'

const CONTENT_TYPES = ['hero', 'features', 'pricing'] as const
const PAGE_SIZE = 8

export function ContentPage() {
  const [type, setType] = useState<(typeof CONTENT_TYPES)[number]>('hero')
  const [items, setItems] = useState<ContentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState({ title: '', subtitle: '', description: '', cta_text: '', cta_link: '', is_active: 'true', sort_order: 0 })

  const load = useCallback(async (selectedType = type) => {
    setLoading(true)
    setError('')
    try {
      setItems(await contentService.list(selectedType))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat konten')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => {
    void load(type)
  }, [type, load])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return items
    return items.filter((item) => [item.title, item.subtitle, item.description, item.cta_text].some((v) => v.toLowerCase().includes(q)))
  }, [items, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const resetForm = () => {
    setEditingId('')
    setForm({ title: '', subtitle: '', description: '', cta_text: '', cta_link: '', is_active: 'true', sort_order: 0 })
  }

  const targetDelete = items.find((item) => item.id === confirmDeleteId)

  return (
    <div className="stack-lg">
      <PageHeader
        title="Editable Content"
        description="Kelola konten landing page dengan CRUD lengkap."
        rightContent={
          <button
            className="btn"
            onClick={() => {
              resetForm()
              setOpen(true)
            }}
            type="button"
          >
            Tambah Konten
          </button>
        }
      />

      <div className="card row between">
        <div className="row">
          <label className="field-inline">
            <span>Tipe</span>
            <select value={type} onChange={(e) => setType(e.target.value as (typeof CONTENT_TYPES)[number])}>
              {CONTENT_TYPES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <input placeholder="Cari title/subtitle/description" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-secondary" onClick={() => void load(type)} type="button">
          Refresh
        </button>
      </div>

      <div className="card">
        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={() => void load(type)} /> : null}
        {feedback ? <p className={feedback.toLowerCase().includes('gagal') ? 'error-text' : 'success-text'}>{feedback}</p> : null}
        {!loading && !error && paged.length === 0 ? <EmptyState /> : null}
        {!loading && !error && paged.length > 0 ? (
          <>
            <DataTable
              rows={paged}
              columns={[
                { header: 'ID', cell: (row) => row.id },
                { header: 'Title', cell: (row) => row.title },
                { header: 'Subtitle', cell: (row) => row.subtitle },
                { header: 'CTA', cell: (row) => row.cta_text || '-' },
                { header: 'Aktif', cell: (row) => row.is_active },
                {
                  header: 'Aksi',
                  cell: (row) => (
                    <div className="row">
                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => {
                          setEditingId(row.id)
                          setForm({
                            title: row.title,
                            subtitle: row.subtitle,
                            description: row.description,
                            cta_text: row.cta_text,
                            cta_link: row.cta_link,
                            is_active: row.is_active,
                            sort_order: row.sort_order,
                          })
                          setOpen(true)
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

      <Modal open={open} onClose={() => setOpen(false)} title={editingId ? 'Edit Konten' : 'Tambah Konten'}>
        <form
          className="form-stack"
          onSubmit={async (event) => {
            event.preventDefault()
            setFeedback('')
            try {
              if (editingId) {
                await contentService.update(type, { id: editingId, ...form })
                setFeedback('Konten berhasil diperbarui.')
              } else {
                await contentService.create(type, form)
                setFeedback('Konten berhasil ditambahkan.')
              }
              resetForm()
              setOpen(false)
              await load(type)
            } catch (err) {
              setFeedback(err instanceof Error ? err.message : 'Gagal menyimpan konten')
            }
          }}
        >
          <label className="field"><span>Title</span><input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required /></label>
          <label className="field"><span>Subtitle</span><input value={form.subtitle} onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))} required /></label>
          <label className="field"><span>Description</span><input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></label>
          <label className="field"><span>CTA Text</span><input value={form.cta_text} onChange={(e) => setForm((p) => ({ ...p, cta_text: e.target.value }))} /></label>
          <label className="field"><span>CTA Link</span><input value={form.cta_link} onChange={(e) => setForm((p) => ({ ...p, cta_link: e.target.value }))} /></label>
          <label className="field">
            <span>Aktif</span>
            <select value={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.value }))}>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </label>
          <label className="field"><span>Sort Order</span><input type="number" value={String(form.sort_order)} onChange={(e) => setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))} /></label>
          <button className="btn" type="submit">{editingId ? 'Simpan Perubahan' : 'Simpan Konten'}</button>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(confirmDeleteId)}
        title="Hapus Konten"
        message={`Yakin ingin menghapus konten ${targetDelete?.title ?? ''}?`}
        busy={deleting}
        onCancel={() => setConfirmDeleteId('')}
        onConfirm={() => {
          void (async () => {
            if (!confirmDeleteId) return
            setDeleting(true)
            setFeedback('')
            try {
              await contentService.remove(type, confirmDeleteId)
              setFeedback('Konten berhasil dihapus.')
              await load(type)
            } catch (err) {
              setFeedback(err instanceof Error ? err.message : 'Gagal menghapus konten')
            } finally {
              setDeleting(false)
              setConfirmDeleteId('')
            }
          })()
        }}
      />
    </div>
  )
}
