import { useEffect, useMemo, useState } from 'react'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { DataTable } from '../../components/ui/DataTable'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { FormField } from '../../components/ui/FormField'
import { LoadingState } from '../../components/ui/LoadingState'
import { Pagination } from '../../components/ui/Pagination'
import { PageHeader } from '../../components/ui/PageHeader'
import { useAuth } from '../auth/useAuth'
import { examSchema } from '../../lib/validators'
import { useResource } from '../../hooks/useResource'
import { examinationsService, patientsService, remindersService, queueService } from '../../services/api/services'
import type { Patient, QueueItem } from '../../types/domain'
import { todayDateISO } from '../../utils/date'

const PAGE_SIZE = 8

export function ExaminationsPage() {
  const { user } = useAuth()
  const { items, loading, error, refresh, create, update, remove } = useResource(examinationsService)
  const [patients, setPatients] = useState<Patient[]>([])
  const [queueItems, setQueueItems] = useState<QueueItem[]>([])
  const [editingId, setEditingId] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [search, setSearch] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [page, setPage] = useState(1)
  const [submitError, setSubmitError] = useState('')
  const [feedback, setFeedback] = useState('')

  const [form, setForm] = useState({
    tanggal: todayDateISO(),
    pasien_id: '',
    antrian_id: '',
    tenaga_medis: user?.nama ?? '',
    diagnosa: '',
    analisa: '',
    tindakan: '',
    catatan: '',
    tgl_kembali: '',
    keperluan_kembali: '',
  })

  useEffect(() => {
    const loadReference = async () => {
      try {
        const [patientData, queueData] = await Promise.all([patientsService.list(), queueService.list()])
        setPatients(patientData)
        setQueueItems(queueData)
      } catch {
        setPatients([])
        setQueueItems([])
      }
    }
    void loadReference()
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return items.filter((item) => {
      const passSearch = q
        ? [item.pemeriksaan_id, item.diagnosa, item.analisa, item.tenaga_medis].some((val) => val.toLowerCase().includes(q))
        : true
      const passDate = filterDate ? item.tanggal === filterDate : true
      return passSearch && passDate
    })
  }, [items, search, filterDate])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const resetForm = () => {
    setEditingId('')
    setForm({
      tanggal: todayDateISO(),
      pasien_id: '',
      antrian_id: '',
      tenaga_medis: user?.nama ?? '',
      diagnosa: '',
      analisa: '',
      tindakan: '',
      catatan: '',
      tgl_kembali: '',
      keperluan_kembali: '',
    })
  }

  const targetDelete = items.find((item) => item.pemeriksaan_id === confirmDeleteId)

  return (
    <div className="stack-lg">
      <PageHeader title="Pemeriksaan / Diagnosa" description="CRUD pemeriksaan dengan relasi antrian dan auto reminder kontrol." />

      <div className="card">
        <div className="row between">
          <h3>{editingId ? 'Edit Pemeriksaan' : 'Input Pemeriksaan'}</h3>
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
              const parsed = examSchema.parse(form)
              if (editingId) {
                await update({ pemeriksaan_id: editingId, ...form, ...parsed })
                setFeedback('Pemeriksaan berhasil diperbarui.')
              } else {
                await create({ ...form, ...parsed })

                if (form.tgl_kembali && form.keperluan_kembali) {
                  const selectedPatient = patients.find((item) => item.pasien_id === form.pasien_id)
                  await remindersService.create({
                    pasien_id: form.pasien_id,
                    nama: selectedPatient?.nama ?? 'Pasien',
                    no_wa: selectedPatient?.hp ?? '',
                    jenis: form.keperluan_kembali,
                    waktu: form.tgl_kembali,
                    status: 'Belum Dihubungi',
                    catatan_cs: 'Auto-generated dari pemeriksaan',
                  })
                }

                setFeedback('Pemeriksaan berhasil ditambahkan.')
              }

              resetForm()
            } catch (err) {
              setSubmitError(err instanceof Error ? err.message : 'Gagal simpan pemeriksaan')
            }
          }}
        >
          <FormField label="Tanggal" type="date" value={form.tanggal} onChange={(e) => setForm((p) => ({ ...p, tanggal: e.target.value }))} required />
          <label className="field">
            <span>Pasien</span>
            <select value={form.pasien_id} onChange={(e) => setForm((p) => ({ ...p, pasien_id: e.target.value }))} required>
              <option value="">Pilih pasien</option>
              {patients.map((patient) => (
                <option key={patient.pasien_id} value={patient.pasien_id}>
                  {patient.nama}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Antrian</span>
            <select value={form.antrian_id} onChange={(e) => setForm((p) => ({ ...p, antrian_id: e.target.value }))}>
              <option value="">Opsional</option>
              {queueItems.map((queue) => (
                <option key={queue.id_antrian} value={queue.id_antrian}>
                  {queue.id_antrian} - {queue.nama_pasien}
                </option>
              ))}
            </select>
          </label>
          <FormField label="Tenaga Medis" value={form.tenaga_medis} onChange={(e) => setForm((p) => ({ ...p, tenaga_medis: e.target.value }))} required />
          <FormField label="Diagnosa" value={form.diagnosa} onChange={(e) => setForm((p) => ({ ...p, diagnosa: e.target.value }))} required />
          <FormField label="Analisa" value={form.analisa} onChange={(e) => setForm((p) => ({ ...p, analisa: e.target.value }))} required />
          <FormField label="Tindakan" value={form.tindakan} onChange={(e) => setForm((p) => ({ ...p, tindakan: e.target.value }))} />
          <FormField label="Catatan" value={form.catatan} onChange={(e) => setForm((p) => ({ ...p, catatan: e.target.value }))} />
          <FormField label="Tanggal Kontrol" type="date" value={form.tgl_kembali} onChange={(e) => setForm((p) => ({ ...p, tgl_kembali: e.target.value }))} />
          <FormField label="Keperluan Kembali" value={form.keperluan_kembali} onChange={(e) => setForm((p) => ({ ...p, keperluan_kembali: e.target.value }))} />
          <button className="btn" type="submit">
            {editingId ? 'Simpan Perubahan' : 'Simpan Pemeriksaan'}
          </button>
          {submitError ? <p className="error-text grid-span-3">{submitError}</p> : null}
          {feedback ? <p className="success-text grid-span-3">{feedback}</p> : null}
        </form>
      </div>

      <div className="card">
        <div className="row between">
          <h3>Riwayat Pemeriksaan</h3>
          <div className="row">
            <input placeholder="Cari ID/diagnosa/medis" value={search} onChange={(e) => setSearch(e.target.value)} />
            <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          </div>
        </div>

        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={() => void refresh()} /> : null}
        {!loading && !error && paged.length === 0 ? <EmptyState /> : null}
        {!loading && !error && paged.length > 0 ? (
          <>
            <DataTable
              rows={paged}
              columns={[
                { header: 'ID', cell: (row) => row.pemeriksaan_id },
                { header: 'Tanggal', cell: (row) => row.tanggal },
                { header: 'Diagnosa', cell: (row) => row.diagnosa },
                { header: 'Analisa', cell: (row) => row.analisa },
                { header: 'Kontrol', cell: (row) => row.tgl_kembali || '-' },
                {
                  header: 'Aksi',
                  cell: (row) => (
                    <div className="row">
                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => {
                          setEditingId(row.pemeriksaan_id)
                          setForm({
                            tanggal: row.tanggal,
                            pasien_id: row.pasien_id,
                            antrian_id: row.antrian_id,
                            tenaga_medis: row.tenaga_medis,
                            diagnosa: row.diagnosa,
                            analisa: row.analisa,
                            tindakan: row.tindakan,
                            catatan: row.catatan,
                            tgl_kembali: row.tgl_kembali,
                            keperluan_kembali: row.keperluan_kembali,
                          })
                        }}
                      >
                        Edit
                      </button>
                      <button className="btn btn-danger" type="button" onClick={() => setConfirmDeleteId(row.pemeriksaan_id)}>
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
        title="Hapus Pemeriksaan"
        message={`Yakin ingin menghapus pemeriksaan ${targetDelete?.pemeriksaan_id ?? ''}?`}
        busy={deleting}
        onCancel={() => setConfirmDeleteId('')}
        onConfirm={() => {
          void (async () => {
            if (!confirmDeleteId) return
            setDeleting(true)
            try {
              await remove({ pemeriksaan_id: confirmDeleteId })
              setFeedback('Pemeriksaan berhasil dihapus.')
            } catch (err) {
              setSubmitError(err instanceof Error ? err.message : 'Gagal menghapus pemeriksaan')
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
