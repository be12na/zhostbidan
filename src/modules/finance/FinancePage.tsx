import { useMemo, useState } from 'react'
import { DataTable } from '../../components/ui/DataTable'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { FormField } from '../../components/ui/FormField'
import { LoadingState } from '../../components/ui/LoadingState'
import { PageHeader } from '../../components/ui/PageHeader'
import { FINANCE_EXPENSE_CATEGORIES, FINANCE_INCOME_CATEGORIES } from '../../constants/finance'
import { useAuth } from '../auth/useAuth'
import { financeSchema } from '../../lib/validators'
import { useResource } from '../../hooks/useResource'
import { financeService } from '../../services/api/services'
import { exportToCSV } from '../../utils/exportCsv'
import { todayDateISO } from '../../utils/date'

export function FinancePage() {
  const { user } = useAuth()
  const { items, loading, error, refresh, create } = useResource(financeService)
  const [jenisFilter, setJenisFilter] = useState('')
  const [kategoriFilter, setKategoriFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [form, setForm] = useState({
    tanggal: todayDateISO(),
    jenis: 'Masuk' as 'Masuk' | 'Keluar',
    kategori: FINANCE_INCOME_CATEGORIES[0],
    nominal: 0,
    keterangan: '',
  })
  const [submitError, setSubmitError] = useState('')

  const categories = form.jenis === 'Masuk' ? FINANCE_INCOME_CATEGORIES : FINANCE_EXPENSE_CATEGORIES

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const passJenis = jenisFilter ? item.jenis === jenisFilter : true
      const passKategori = kategoriFilter ? item.kategori === kategoriFilter : true
      const passStart = startDate ? item.tanggal >= startDate : true
      const passEnd = endDate ? item.tanggal <= endDate : true
      return passJenis && passKategori && passStart && passEnd
    })
  }, [items, jenisFilter, kategoriFilter, startDate, endDate])

  const totalMasuk = filteredItems.filter((item) => item.jenis === 'Masuk').reduce((sum, item) => sum + item.nominal, 0)
  const totalKeluar = filteredItems.filter((item) => item.jenis === 'Keluar').reduce((sum, item) => sum + item.nominal, 0)

  return (
    <div className="stack-lg">
      <PageHeader
        title="Keuangan Klinik"
        description="Pemasukan dan pengeluaran dari sheet Keuangan dengan filter dan ekspor CSV."
        rightContent={
          <button className="btn btn-secondary" onClick={() => exportToCSV('keuangan-klinik.csv', filteredItems)} type="button">
            Export CSV
          </button>
        }
      />

      <div className="grid-3">
        <article className="card"><h3>Pemasukan</h3><p className="metric">Rp {totalMasuk.toLocaleString('id-ID')}</p></article>
        <article className="card"><h3>Pengeluaran</h3><p className="metric">Rp {totalKeluar.toLocaleString('id-ID')}</p></article>
        <article className="card"><h3>Saldo</h3><p className="metric">Rp {(totalMasuk - totalKeluar).toLocaleString('id-ID')}</p></article>
      </div>

      <div className="card">
        <h3>Input Transaksi</h3>
        <form
          className="grid-4"
          onSubmit={async (event) => {
            event.preventDefault()
            setSubmitError('')
            try {
              const parsed = financeSchema.parse(form)
              await create({ ...parsed, created_by: user?.email ?? 'system' })
            } catch (err) {
              setSubmitError(err instanceof Error ? err.message : 'Gagal simpan transaksi')
            }
          }}
        >
          <FormField label="Tanggal" type="date" value={form.tanggal} onChange={(e) => setForm((p) => ({ ...p, tanggal: e.target.value }))} required />
          <label className="field">
            <span>Jenis</span>
            <select
              value={form.jenis}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  jenis: e.target.value as 'Masuk' | 'Keluar',
                  kategori: e.target.value === 'Masuk' ? FINANCE_INCOME_CATEGORIES[0] : FINANCE_EXPENSE_CATEGORIES[0],
                }))
              }
            >
              <option value="Masuk">Masuk</option>
              <option value="Keluar">Keluar</option>
            </select>
          </label>
          <label className="field">
            <span>Kategori</span>
            <select value={form.kategori} onChange={(e) => setForm((p) => ({ ...p, kategori: e.target.value }))}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <FormField label="Nominal" type="number" value={String(form.nominal)} onChange={(e) => setForm((p) => ({ ...p, nominal: Number(e.target.value) }))} required />
          <FormField label="Keterangan" value={form.keterangan} onChange={(e) => setForm((p) => ({ ...p, keterangan: e.target.value }))} required />
          <button className="btn" type="submit">Simpan</button>
          {submitError ? <p className="error-text grid-span-4">{submitError}</p> : null}
        </form>
      </div>

      <div className="card">
        <div className="row between">
          <h3>Daftar Transaksi</h3>
          <div className="row">
            <select value={jenisFilter} onChange={(e) => setJenisFilter(e.target.value)}>
              <option value="">Semua Jenis</option>
              <option value="Masuk">Masuk</option>
              <option value="Keluar">Keluar</option>
            </select>
            <input placeholder="Kategori" value={kategoriFilter} onChange={(e) => setKategoriFilter(e.target.value)} />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={() => void refresh()} /> : null}
        {!loading && !error && filteredItems.length === 0 ? <EmptyState /> : null}
        {!loading && !error && filteredItems.length > 0 ? (
          <DataTable
            rows={filteredItems}
            columns={[
              { header: 'Tanggal', cell: (row) => row.tanggal },
              { header: 'Jenis', cell: (row) => row.jenis },
              { header: 'Kategori', cell: (row) => row.kategori },
              { header: 'Nominal', cell: (row) => `Rp ${row.nominal.toLocaleString('id-ID')}` },
              { header: 'Keterangan', cell: (row) => row.keterangan },
            ]}
          />
        ) : null}
      </div>
    </div>
  )
}
