import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '../../components/ui/DataTable'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { FormField } from '../../components/ui/FormField'
import { LoadingState } from '../../components/ui/LoadingState'
import { PageHeader } from '../../components/ui/PageHeader'
import { REPORT_FIELDS, REPORT_TYPE_OPTIONS, type ReportType } from '../../constants/reports'
import { reportsService } from '../../services/api/services'
import type { ReportRecord } from '../../types/domain'
import { exportToCSV } from '../../utils/exportCsv'
import { todayDateISO } from '../../utils/date'

export function ReportsPage() {
  const [type, setType] = useState<ReportType>('anc')
  const [items, setItems] = useState<ReportRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState<Record<string, string>>({ tanggal: todayDateISO(), pasien: '', keterangan: '' })

  const load = async (selectedType: ReportType) => {
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
  }

  useEffect(() => {
    void load(type)
  }, [type])

  const fields = useMemo(() => REPORT_FIELDS[type], [type])

  return (
    <div className="stack-lg">
      <PageHeader
        title="Laporan Klinik"
        description="Form laporan data-driven per jenis laporan dengan dukungan export CSV."
        rightContent={
          <button className="btn btn-secondary" onClick={() => exportToCSV(`laporan-${type}.csv`, items)} type="button">
            Export CSV
          </button>
        }
      />

      <div className="card">
        <div className="row between">
          <h3>Input Laporan</h3>
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
        </div>

        <form
          className="grid-3"
          onSubmit={async (event) => {
            event.preventDefault()
            await reportsService.create(type, form)
            await load(type)
            setForm({ tanggal: todayDateISO(), pasien: '', keterangan: '' })
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
            Simpan Laporan
          </button>
        </form>
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
              { header: 'Tanggal', cell: (row) => row.tanggal || '-' },
              { header: 'Pasien', cell: (row) => row.pasien || '-' },
              { header: 'Keterangan', cell: (row) => row.keterangan || '-' },
            ]}
          />
        ) : null}
      </div>
    </div>
  )
}
