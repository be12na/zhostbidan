import type { SessionUser } from '../types/domain'

const SESSION_KEY = 'klinik.session.v1'

export function getStoredSession() {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as SessionUser
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function setStoredSession(user: SessionUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function clearStoredSession() {
  localStorage.removeItem(SESSION_KEY)
}
