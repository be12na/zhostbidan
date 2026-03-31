import { useMemo, useState } from 'react'
import { DataTable } from '../../components/ui/DataTable'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { FormField } from '../../components/ui/FormField'
import { LoadingState } from '../../components/ui/LoadingState'
import { PageHeader } from '../../components/ui/PageHeader'
import { patientSchema } from '../../lib/validators'
import { useResource } from '../../hooks/useResource'
import { patientsService } from '../../services/api/services'
import { calculateAge, todayDateISO } from '../../utils/date'

export function PatientsPage() {
  const { items, loading, error, refresh, create } = useResource(patientsService)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ nama: '', nik: '', hp: '', tanggal_lahir: '', jenis_kelamin: 'P' as 'L' | 'P' })
  const [submitError, setSubmitError] = useState('')

  const filteredItems = useMemo(() => {
    const q = search.toLowerCase()
    return items.filter((item) => [item.nama, item.no_rm, item.nik, item.hp].some((value) => value.toLowerCase().includes(q)))
  }, [items, search])

  return (
    <div className="stack-lg">
      <PageHeader title="Data Pasien" description="Create, read, update data pasien dari sheet Pasien." />

      <div className="card">
        <h3>Input Pasien Baru</h3>
        <form
          className="grid-3"
          onSubmit={async (event) => {
            event.preventDefault()
            setSubmitError('')
            try {
              const parsed = patientSchema.parse(form)
              await create(parsed)
              setForm({ nama: '', nik: '', hp: '', tanggal_lahir: '', jenis_kelamin: 'P' })
            } catch (err) {
              setSubmitError(err instanceof Error ? err.message : 'Gagal simpan pasien')
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
          {submitError ? <p className="error-text grid-span-3">{submitError}</p> : null}
          <button className="btn" type="submit">
            Simpan Pasien
          </button>
        </form>
      </div>

      <div className="card">
        <div className="row between">
          <h3>Daftar Pasien</h3>
          <div className="row">
            <input placeholder="Cari nama / no RM / NIK / HP" value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="btn btn-secondary" onClick={() => refresh()} type="button">
              Refresh
            </button>
          </div>
        </div>

        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={() => void refresh()} /> : null}
        {!loading && !error && filteredItems.length === 0 ? <EmptyState /> : null}
        {!loading && !error && filteredItems.length > 0 ? (
          <DataTable
            rows={filteredItems}
            columns={[
              { header: 'No RM', cell: (row) => row.no_rm },
              { header: 'Nama', cell: (row) => row.nama },
              { header: 'NIK', cell: (row) => row.nik },
              { header: 'HP', cell: (row) => row.hp },
              { header: 'Last Visit', cell: (row) => row.last_visit || todayDateISO() },
            ]}
          />
        ) : null}
      </div>
    </div>
  )
}
