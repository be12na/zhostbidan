import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { clearStoredSession, getStoredSession, setStoredSession } from '../../lib/storage'
import { loginSchema } from '../../lib/validators'
import { authService } from '../../services/api/services'
import type { SessionUser } from '../../types/domain'
import { AuthContext, type AuthContextValue } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => getStoredSession())
  const [loading, setLoading] = useState(false)

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(email: string) {
        const parsed = loginSchema.parse({ email })
        setLoading(true)
        try {
          const loginResult = await authService.login(parsed.email)
          setUser(loginResult)
          setStoredSession(loginResult)
        } finally {
          setLoading(false)
        }
      },
      logout() {
        setUser(null)
        clearStoredSession()
      },
    }),
    [loading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
