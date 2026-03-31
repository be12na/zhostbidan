import { useEffect, useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { financeService, patientsService, queueService, remindersService } from '../services/api/services'
import type { FinanceTransaction, Patient, QueueItem, Reminder } from '../types/domain'

export function OverviewPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [finance, setFinance] = useState<FinanceTransaction[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [patientData, queueData, financeData, reminderData] = await Promise.all([
          patientsService.list(),
          queueService.list(),
          financeService.list(),
          remindersService.list(),
        ])
        setPatients(patientData)
        setQueue(queueData)
        setFinance(financeData)
        setReminders(reminderData)
      } catch {
        setPatients([])
        setQueue([])
        setFinance([])
        setReminders([])
      }
    }
    void load()
  }, [])

  const pemasukan = finance.filter((item) => item.jenis === 'Masuk').reduce((sum, item) => sum + item.nominal, 0)
  const pengeluaran = finance.filter((item) => item.jenis === 'Keluar').reduce((sum, item) => sum + item.nominal, 0)

  return (
    <div className="stack-lg">
      <PageHeader
        title="Dashboard Operasional"
        description="Ringkasan real-time dari data API Google Sheets melalui Google Apps Script."
      />
      <div className="grid-4">
        <article className="card">
          <h3>Total Pasien</h3>
          <p className="metric">{patients.length}</p>
        </article>
        <article className="card">
          <h3>Antrian Aktif</h3>
          <p className="metric">{queue.filter((item) => item.status !== 'Selesai' && item.status !== 'Batal').length}</p>
        </article>
        <article className="card">
          <h3>Reminder Pending</h3>
          <p className="metric">{reminders.filter((item) => item.status !== 'Sudah Dihubungi').length}</p>
        </article>
        <article className="card">
          <h3>Saldo</h3>
          <p className="metric">Rp {(pemasukan - pengeluaran).toLocaleString('id-ID')}</p>
        </article>
      </div>
    </div>
  )
}
