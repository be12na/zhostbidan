import { useCallback, useEffect, useState } from 'react'
import { DataTable } from '../../components/ui/DataTable'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'
import { contentService } from '../../services/api/services'
import type { ContentRecord } from '../../types/domain'

const CONTENT_TYPES = ['hero', 'features', 'pricing'] as const

export function ContentPage() {
  const [type, setType] = useState<(typeof CONTENT_TYPES)[number]>('hero')
  const [items, setItems] = useState<ContentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', subtitle: '', description: '', cta_text: '', cta_link: '' })

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

  return (
    <div className="stack-lg">
      <PageHeader
        title="Editable Content"
        description="Konten landing page tersimpan di Google Sheets dan dapat dikelola tanpa hardcode komponen."
        rightContent={
          <button className="btn" onClick={() => setOpen(true)} type="button">
            Tambah Konten
          </button>
        }
      />

      <div className="card row between">
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
        <button className="btn btn-secondary" onClick={() => void load(type)} type="button">
          Refresh
        </button>
      </div>

      <div className="card">
        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={() => void load(type)} /> : null}
        {!loading && !error && items.length === 0 ? <EmptyState /> : null}
        {!loading && !error && items.length > 0 ? (
          <DataTable
            rows={items}
            columns={[
              { header: 'ID', cell: (row) => row.id },
              { header: 'Title', cell: (row) => row.title },
              { header: 'Subtitle', cell: (row) => row.subtitle },
              { header: 'CTA', cell: (row) => row.cta_text || '-' },
              { header: 'Aktif', cell: (row) => row.is_active },
            ]}
          />
        ) : null}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Tambah Konten">
        <form
          className="form-stack"
          onSubmit={async (event) => {
            event.preventDefault()
            await contentService.create(type, form)
            setForm({ title: '', subtitle: '', description: '', cta_text: '', cta_link: '' })
            setOpen(false)
            await load(type)
          }}
        >
          <label className="field"><span>Title</span><input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required /></label>
          <label className="field"><span>Subtitle</span><input value={form.subtitle} onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))} required /></label>
          <label className="field"><span>Description</span><input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></label>
          <label className="field"><span>CTA Text</span><input value={form.cta_text} onChange={(e) => setForm((p) => ({ ...p, cta_text: e.target.value }))} /></label>
          <label className="field"><span>CTA Link</span><input value={form.cta_link} onChange={(e) => setForm((p) => ({ ...p, cta_link: e.target.value }))} /></label>
          <button className="btn" type="submit">Simpan Konten</button>
        </form>
      </Modal>
    </div>
  )
}
