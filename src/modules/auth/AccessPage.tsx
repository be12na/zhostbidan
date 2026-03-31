import { useMemo, useState } from 'react'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { DataTable } from '../../components/ui/DataTable'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { FormField } from '../../components/ui/FormField'
import { LoadingState } from '../../components/ui/LoadingState'
import { Pagination } from '../../components/ui/Pagination'
import { PageHeader } from '../../components/ui/PageHeader'
import { ROLES } from '../../constants/roles'
import { useResource } from '../../hooks/useResource'
import { usersService } from '../../services/api/services'
import type { Role } from '../../types/domain'

interface AccessForm {
  user_id?: string
  nama: string
  email: string
  role: Role
  status: 'aktif' | 'nonaktif'
}

const PAGE_SIZE = 8

export function AccessPage() {
  const { items, loading, error, refresh, create, update, remove } = useResource(usersService)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [form, setForm] = useState<AccessForm>({ nama: '', email: '', role: 'cs', status: 'aktif' })
  const [feedback, setFeedback] = useState('')
  const [confirmUserId, setConfirmUserId] = useState<string>('')
  const [deleting, setDeleting] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return items
    return items.filter((item) => [item.nama, item.email, item.role, item.status].some((text) => text.toLowerCase().includes(q)))
  }, [items, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const resetForm = () => {
    setForm({ nama: '', email: '', role: 'cs', status: 'aktif' })
  }

  const selectedDeleteUser = items.find((item) => item.user_id === confirmUserId)

  return (
    <div className="stack-lg">
      <PageHeader title="Hak Akses User" description="Kelola user internal dengan alur CRUD lengkap." />

      <div className="card">
        <div className="row between">
          <h3>{form.user_id ? 'Edit User' : 'Tambah User'}</h3>
          {form.user_id ? (
            <button className="btn btn-secondary" type="button" onClick={resetForm}>
              Batal Edit
            </button>
          ) : null}
        </div>

        <form
          className="grid-4"
          onSubmit={async (event) => {
            event.preventDefault()
            setFeedback('')

            try {
              if (form.user_id) {
                await update({ user_id: form.user_id, nama: form.nama, email: form.email, role: form.role, status: form.status })
                setFeedback('User berhasil diperbarui.')
              } else {
                await create({ nama: form.nama, email: form.email, role: form.role, status: form.status })
                setFeedback('User berhasil ditambahkan.')
              }
              resetForm()
            } catch (err) {
              setFeedback(err instanceof Error ? err.message : 'Gagal menyimpan user')
            }
          }}
        >
          <FormField label="Nama" value={form.nama} onChange={(e) => setForm((prev) => ({ ...prev, nama: e.target.value }))} required />
          <FormField label="Email" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
          <label className="field">
            <span>Role</span>
            <select value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value as Role }))}>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Status</span>
            <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as 'aktif' | 'nonaktif' }))}>
              <option value="aktif">aktif</option>
              <option value="nonaktif">nonaktif</option>
            </select>
          </label>
          <button className="btn" type="submit">
            {form.user_id ? 'Simpan Perubahan' : 'Tambah User'}
          </button>
          {feedback ? <p className={feedback.toLowerCase().includes('gagal') ? 'error-text grid-span-4' : 'success-text grid-span-4'}>{feedback}</p> : null}
        </form>
      </div>

      <div className="card">
        <div className="row between">
          <h3>Daftar User</h3>
          <div className="row">
            <input placeholder="Cari nama/email/role/status" value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="btn btn-secondary" type="button" onClick={() => void refresh()}>
              Refresh
            </button>
          </div>
        </div>

        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={() => void refresh()} /> : null}
        {!loading && !error && paged.length === 0 ? <EmptyState message="Tidak ada user yang cocok." /> : null}

        {!loading && !error && paged.length > 0 ? (
          <>
            <DataTable
              rows={paged}
              columns={[
                { header: 'Nama', cell: (row) => row.nama },
                { header: 'Email', cell: (row) => row.email },
                { header: 'Role', cell: (row) => row.role },
                { header: 'Status', cell: (row) => row.status },
                {
                  header: 'Aksi',
                  cell: (row) => (
                    <div className="row">
                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() =>
                          setForm({
                            user_id: row.user_id,
                            nama: row.nama,
                            email: row.email,
                            role: row.role,
                            status: row.status,
                          })
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        type="button"
                        disabled={row.role === 'pemilik'}
                        onClick={() => setConfirmUserId(row.user_id)}
                      >
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
        open={Boolean(confirmUserId)}
        title="Hapus User"
        message={`Yakin ingin menghapus user ${selectedDeleteUser?.nama ?? ''}?`}
        onCancel={() => setConfirmUserId('')}
        busy={deleting}
        onConfirm={() => {
          void (async () => {
            if (!confirmUserId) return
            setDeleting(true)
            setFeedback('')
            try {
              await remove({ user_id: confirmUserId })
              setFeedback('User berhasil dihapus.')
            } catch (err) {
              setFeedback(err instanceof Error ? err.message : 'Gagal menghapus user')
            } finally {
              setDeleting(false)
              setConfirmUserId('')
            }
          })()
        }}
      />
    </div>
  )
}
