import { useEffect, useState } from 'react'
import { DataTable } from '../../components/ui/DataTable'
import { EmptyState } from '../../components/ui/EmptyState'
import { ErrorState } from '../../components/ui/ErrorState'
import { FormField } from '../../components/ui/FormField'
import { LoadingState } from '../../components/ui/LoadingState'
import { PageHeader } from '../../components/ui/PageHeader'
import { useAuth } from '../auth/useAuth'
import { examSchema } from '../../lib/validators'
import { useResource } from '../../hooks/useResource'
import { examinationsService, patientsService, remindersService, queueService } from '../../services/api/services'
import type { Patient, QueueItem } from '../../types/domain'
import { todayDateISO } from '../../utils/date'

export function ExaminationsPage() {
  const { user } = useAuth()
  const { items, loading, error, refresh, create } = useResource(examinationsService)
  const [patients, setPatients] = useState<Patient[]>([])
  const [queueItems, setQueueItems] = useState<QueueItem[]>([])
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
  const [submitError, setSubmitError] = useState('')

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

  return (
    <div className="stack-lg">
      <PageHeader title="Pemeriksaan / Diagnosa" description="Data pemeriksaan tersimpan ke sheet Pemeriksaan dan dapat memicu reminder." />

      <div className="card">
        <h3>Input Pemeriksaan</h3>
        <form
          className="grid-3"
          onSubmit={async (event) => {
            event.preventDefault()
            setSubmitError('')

            try {
              const parsed = examSchema.parse(form)
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
          {submitError ? <p className="error-text grid-span-3">{submitError}</p> : null}
          <button className="btn" type="submit">
            Simpan Pemeriksaan
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Riwayat Pemeriksaan</h3>
        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={error} onRetry={() => void refresh()} /> : null}
        {!loading && !error && items.length === 0 ? <EmptyState /> : null}
        {!loading && !error && items.length > 0 ? (
          <DataTable
            rows={items}
            columns={[
              { header: 'ID', cell: (row) => row.pemeriksaan_id },
              { header: 'Tanggal', cell: (row) => row.tanggal },
              { header: 'Diagnosa', cell: (row) => row.diagnosa },
              { header: 'Analisa', cell: (row) => row.analisa },
              { header: 'Kontrol', cell: (row) => row.tgl_kembali || '-' },
            ]}
          />
        ) : null}
      </div>
    </div>
  )
}
