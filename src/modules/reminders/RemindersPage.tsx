import { useMemo, useState } from 'react'
import { DataTable } from '../../components/ui/DataTable'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { LoadingState } from '../../components/ui/LoadingState'
import { PageHeader } from '../../components/ui/PageHeader'
import { useResource } from '../../hooks/useResource'
import { remindersService } from '../../services/api/services'
import { normalizeIndonesianPhone } from '../../utils/phone'

export function RemindersPage() {
  const { items, loading, error, refresh, update } = useResource(remindersService)
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const statusOk = statusFilter ? item.status === statusFilter : true
        const dateOk = dateFilter ? item.waktu === dateFilter : true
        return statusOk && dateOk
      }),
    [items, dateFilter, statusFilter],
  )

  return (
    <div className="stack-lg">
      <PageHeader title="Reminder Pasien" description="Kelola follow-up pasien dan kirim WhatsApp dengan format nomor bersih." />

      <div className="card row between">
        <div className="row">
          <label className="field-inline">
            <span>Status</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Semua</option>
              <option value="Belum Dihubungi">Belum Dihubungi</option>
              <option value="Sudah Dihubungi">Sudah Dihubungi</option>
              <option value="Follow Up Ulang">Follow Up Ulang</option>
            </select>
          </label>
          <label className="field-inline">
            <span>Tanggal</span>
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
          </label>
        </div>
        <button className="btn btn-secondary" onClick={() => void refresh()} type="button">
          Refresh
        </button>
      </div>

      <div className="card">
        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={() => void refresh()} /> : null}
        {!loading && !error && filteredItems.length === 0 ? <EmptyState /> : null}
        {!loading && !error && filteredItems.length > 0 ? (
          <DataTable
            rows={filteredItems}
            columns={[
              { header: 'Nama', cell: (row) => row.nama },
              { header: 'Jenis', cell: (row) => row.jenis },
              { header: 'Waktu', cell: (row) => row.waktu },
              {
                header: 'Status',
                cell: (row) => (
                  <select
                    value={row.status}
                    onChange={(e) =>
                      void update({ reminder_id: row.reminder_id, status: e.target.value as 'Belum Dihubungi' | 'Sudah Dihubungi' | 'Follow Up Ulang' })
                    }
                  >
                    <option value="Belum Dihubungi">Belum Dihubungi</option>
                    <option value="Sudah Dihubungi">Sudah Dihubungi</option>
                    <option value="Follow Up Ulang">Follow Up Ulang</option>
                  </select>
                ),
              },
              {
                header: 'Aksi',
                cell: (row) => {
                  const waPhone = normalizeIndonesianPhone(row.no_wa)
                  const waMessage = encodeURIComponent(`Halo ${row.nama}, kami mengingatkan jadwal ${row.jenis} pada ${row.waktu}.`)
                  return (
                    <a className="btn btn-secondary" href={`https://wa.me/${waPhone}?text=${waMessage}`} rel="noreferrer" target="_blank">
                      Kirim WA
                    </a>
                  )
                },
              },
            ]}
          />
        ) : null}
      </div>
    </div>
  )
}
