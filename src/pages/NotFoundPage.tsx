import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="centered-page">
      <div className="card form-stack">
        <h1>Halaman tidak ditemukan</h1>
        <p className="muted">URL yang Anda akses tidak tersedia.</p>
        <Link className="btn" to="/">
          Kembali ke Landing
        </Link>
      </div>
    </div>
  )
}
