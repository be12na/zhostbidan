import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { AccessPage } from '../modules/auth/AccessPage'
import { ContentPage } from '../modules/content/ContentPage'
import { ExaminationsPage } from '../modules/examinations/ExaminationsPage'
import { FinancePage } from '../modules/finance/FinancePage'
import { HrdPage } from '../modules/hrd/HrdPage'
import { PatientsPage } from '../modules/patients/PatientsPage'
import { QueuePage } from '../modules/queue/QueuePage'
import { RemindersPage } from '../modules/reminders/RemindersPage'
import { ReportsPage } from '../modules/reports/ReportsPage'
import { LoginPage } from '../pages/LoginPage'
import { LandingPage } from '../pages/LandingPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { OverviewPage } from '../pages/OverviewPage'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="queue" element={<QueuePage />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="examinations" element={<ExaminationsPage />} />
            <Route path="reminders" element={<RemindersPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="hrd" element={<HrdPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="content" element={<ContentPage />} />
            <Route element={<ProtectedRoute allowedRoles={['pemilik']} />}>
              <Route path="access" element={<AccessPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
