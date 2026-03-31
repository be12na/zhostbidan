import { useState } from 'react'
import { DataTable } from '../../components/ui/DataTable'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { FormField } from '../../components/ui/FormField'
import { LoadingState } from '../../components/ui/LoadingState'
import { PageHeader } from '../../components/ui/PageHeader'
import { ROLES } from '../../constants/roles'
import { useResource } from '../../hooks/useResource'
import { usersService } from '../../services/api/services'
import type { Role } from '../../types/domain'

interface AccessForm {
  nama: string
  email: string
  role: Role
  status: 'aktif' | 'nonaktif'
}

export function AccessPage() {
  const { items, loading, error, refresh, create, update } = useResource(usersService)
  const [form, setForm] = useState<AccessForm>({ nama: '', email: '', role: 'cs', status: 'aktif' })

  return (
    <div className="stack-lg">
      <PageHeader title="Hak Akses User" description="Kelola user internal, role, dan status aktif/nonaktif dari sheet Users." />

      <div className="card">
        <h3>Tambah User</h3>
        <form
          className="grid-4"
          onSubmit={async (event) => {
            event.preventDefault()
            await create(form)
            setForm({ nama: '', email: '', role: 'cs', status: 'aktif' })
          }}
        >
          <FormField label="Nama" value={form.nama} onChange={(e) => setForm((p) => ({ ...p, nama: e.target.value }))} required />
          <FormField label="Email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
          <label className="field">
            <span>Role</span>
            <select value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as (typeof ROLES)[number] }))}>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Status</span>
            <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as 'aktif' | 'nonaktif' }))}>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </label>
          <button className="btn" type="submit">Simpan User</button>
        </form>
      </div>

      <div className="card">
        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={() => void refresh()} /> : null}
        {!loading && !error && items.length === 0 ? <EmptyState /> : null}
        {!loading && !error && items.length > 0 ? (
          <DataTable
            rows={items}
            columns={[
              { header: 'Nama', cell: (row) => row.nama },
              { header: 'Email', cell: (row) => row.email },
              { header: 'Role', cell: (row) => row.role },
              {
                header: 'Status',
                cell: (row) => (
                  <select
                    value={row.status}
                    onChange={(e) => void update({ user_id: row.user_id, status: e.target.value as 'aktif' | 'nonaktif' })}
                    disabled={row.role === 'pemilik'}
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
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
