import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../modules/auth/useAuth'

export function LoginPage() {
  const { user, login, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to="/app" replace />
  }

  return (
    <div className="centered-page">
      <form
        className="card form-stack"
        onSubmit={async (event) => {
          event.preventDefault()
          setError('')
          try {
            await login(email)
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Login gagal')
          }
        }}
      >
        <h1>Login Internal Klinik</h1>
        <p className="muted">Masukkan email aktif yang terdaftar di sheet Users.</p>
        <label className="field">
          <span>Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="nama@klinik.com" />
        </label>
        {error ? <p className="error-text">{error}</p> : null}
        <button className="btn" disabled={loading} type="submit">
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </div>
  )
}
