import { NavLink, Outlet } from 'react-router-dom'
import { MENU_ITEMS } from '../constants/menu'
import { ROLE_LABELS } from '../constants/roles'
import { useAuth } from '../modules/auth/useAuth'

export function DashboardLayout() {
  const { user, logout } = useAuth()
  if (!user) return null

  const menu = MENU_ITEMS.filter((item) => item.roles.includes(user.role))

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <h2>Klinik App</h2>
        <p className="muted small">Role: {ROLE_LABELS[user.role]}</p>
        <nav>
          {menu.map((item) => (
            <NavLink key={item.key} to={item.path} end={item.path === '/app'}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <strong>{user.nama}</strong>
            <p className="muted small">{user.email}</p>
          </div>
          <button className="btn btn-secondary" onClick={logout} type="button">
            Logout
          </button>
        </header>
        <section className="content-area">
          <Outlet />
        </section>
      </main>
    </div>
  )
}
